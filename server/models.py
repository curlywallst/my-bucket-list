from sqlalchemy.ext.hybrid import hybrid_property
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, func
from sqlalchemy.orm import relationship, backref
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime, Float
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from marshmallow import Schema, fields

from config import db, bcrypt, ma

convention = {
  "ix": "ix_%(column_0_label)s",
  "uq": "uq_%(table_name)s_%(column_0_name)s",
  "ck": "ck_%(table_name)s_%(constraint_name)s",
  "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
  "pk": "pk_%(table_name)s"
}


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    items = db.relationship('Item', back_populates='user', cascade='all, delete-orphan')

    # buckets = association_proxy('items', 'bucket',
    #                               creator=lambda bucket_obj: Item(bucket=bucket_obj))


    buckets = db.relationship(
        'Bucket',
        secondary='items',
        viewonly=True)

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
    
class Item(db.Model):

    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(250), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bucket_id = db.Column(db.Integer, db.ForeignKey('buckets.id'), nullable=False)

    user = db.relationship('User', back_populates='items')
    bucket = db.relationship('Bucket', back_populates='items')
    
    def __repr__(self):
        return f'Item(id={self.id}, ' + \
            f'title={self.title}, ' + \
            f'content={self.content}, ' + \
            f'user_id={self.user_id})' + \
            f'bucket_id={self.bucket_id})'



class Bucket(db.Model):

    __tablename__ = 'buckets'


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)


    items = db.relationship('Item', back_populates='bucket', lazy=True)


    def __repr__(self):
        return f'Bucket(id={self.id}, ' + \
            f'name={self.name})'
    

class ItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Item
        include_relationships = True

    id = ma.auto_field()
    title = ma.auto_field()
    content = ma.auto_field()
    bucket_id = ma.auto_field()

class BucketSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Bucket
        include_relationships = True

    id = ma.auto_field()
    name = ma.auto_field()
    items = fields.List(fields.Nested(ItemSchema(exclude=("bucket", ))))
  
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        
        # buckets = ma.Nested(BucketSchema(many=True))

    id = ma.auto_field()
    username = ma.auto_field()
    # buckets = fields.List(fields.Nested(BucketSchema()))
    buckets = ma.Method("get_buckets")


    def get_buckets(self, user):
        buckets = user.buckets
        bucket_schema = BucketSchema()
        filtered_buckets = []
        for bucket in buckets:
            filtered_items = [item for item in bucket.items if item.user_id == user.id]
            bucket_data = bucket_schema.dump(bucket)
            bucket_data['items'] = ItemSchema(many=True).dump(filtered_items)
            filtered_buckets.append(bucket_data)

        return filtered_buckets

    


