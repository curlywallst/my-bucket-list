from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, func
from sqlalchemy.orm import relationship, backref
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime, Float
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

convention = {
  "ix": "ix_%(column_0_label)s",
  "uq": "uq_%(table_name)s_%(column_0_name)s",
  "ck": "ck_%(table_name)s_%(constraint_name)s",
  "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
  "pk": "pk_%(table_name)s"
}


# Models go here!
class User(db.Model, SerializerMixin):

    __tablename__ = 'users'

    serialize_rules = ('-items.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    buckets = db.relationship('Bucket', secondary='items', viewonly=True)
    


    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User(id={self.id}, ' + \
            f'username={self.username})'

class Item(db.Model, SerializerMixin):

    __tablename__ = 'items'

    serialize_rules = ('-user.items', '-bucket.items',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(250), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bucket_id = db.Column(db.Integer, db.ForeignKey('buckets.id'), nullable=False)
    
    def __repr__(self):
        return f'Item(id={self.id}, ' + \
            f'title={self.title}, ' + \
            f'content={self.content}, ' + \
            f'user_id={self.user_id})' + \
            f'bucket_id={self.bucket_id})'


class Bucket(db.Model, SerializerMixin):

    __tablename__ = 'buckets'


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)


    items = db.relationship('Item', backref='bucket', lazy=True)


    def __repr__(self):
        return f'Bucket(id={self.id}, ' + \
            f'name={self.name})'
    


