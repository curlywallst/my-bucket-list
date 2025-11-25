#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError


# Local imports
from config import app, db, api
from models import User, Item, Bucket, UserSchema, ItemSchema, BucketSchema

class CheckSession(Resource):
    def get(self):  
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()

            user_schema = UserSchema(exclude = ['_password_hash', 'items'])
            return make_response(user_schema.dump(user), 200)

        return {}, 204

class ClearSession(Resource):
    def delete(self):
        session['page_views'] = None
        session['user_id'] = None
        return {}, 204

class Signup(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']

        if username and password:
            user = User(username=username)
            user.password_hash = password

            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            user_schema = UserSchema(exclude = ['_password_hash', 'items'])
            return make_response(user_schema.dump(user), 200)


        return {'error': 'Input Error - please try again'}, 422

class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter(User.username == username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id

            user_schema = UserSchema(exclude = ['_password_hash', 'items'])
            return make_response(user_schema.dump(user), 200)
        
        return {'error': '401 Unauthorized'}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
class Buckets(Resource):
    def get(self):
        if session.get('user_id'):
            buckets = Bucket.query.all()
            return BucketSchema(many=True, exclude=['items']).dump(buckets)
        
        return {'error': '401 Unauthorized'}, 401
        
    def post(self):
        if session.get('user_id'):
            request_json = request.get_json()
            name = request_json['name']
            bucket = Bucket(name=name)
            db.session.add(bucket)
        try:
            db.session.commit()
            return BucketSchema().dump(bucket), 201

        except IntegrityError as e:
            db.session.rollback()
            return {'error': 'Bucket name must be unique'}, 400

    
class Items(Resource):
    def post(self):
        user_id = session.get('user_id')
        if user_id:
            request_json = request.get_json()

            title = request_json['title']
            content = request_json['content']
            bucket_id = request_json['bucket_id']

            item = Item(title=title, content=content, bucket_id=bucket_id, user_id=user_id)

            db.session.add(item)
            db.session.commit()
            return ItemSchema().dump(item), 201

        return {'error': '401 Unauthorized'}, 401
    
class ItemByID(Resource):
    def delete(self, id):
        if session.get('user_id'):

            item = Item.query.filter_by(id=id).first()
            if item.user_id == session.get('user_id'):
                db.session.delete(item)
                db.session.commit()

                response_dict = {"message": "item successfully deleted"}

                response = make_response(
                    response_dict,
                    200
                )

                return response
            
        return {'error': '401 Unauthorized'}, 401
    
    def patch(self, id):
        user_id = session.get('user_id')
        if user_id:

            request_json = request.get_json()

            title = request_json['title']
            content = request_json['content']

            item = Item.query.filter(Item.id == id).first()
            if item.user_id == session.get('user_id'):
                item.title = title
                item.content = content

                db.session.add(item)
                db.session.commit()

                return ItemSchema().dump(item), 200

        return {'error': '401 Unauthorized'}, 401


api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Buckets, '/buckets', endpoint='buckets')
api.add_resource(Items, '/items', endpoint='items')
api.add_resource(ItemByID, '/items/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)


            # for bucket in user.buckets:
            #     adjusted_items = [item for item in bucket.items if item.user_id == session['user_id'] ]
            #     bucket.items = adjusted_items
         
            #     # bucket.items = Item.query.where(Item.user_id == user.id, Item.bucket_id == bucket.id)
            # return user.to_dict(), 200