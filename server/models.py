from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates, relationship
# from enum import Enum, auto

from config import db, bcrypt
import re




#---------------------------------------------------------------------
#-----------------------SUBSCRIPTION TABLE-----------------------
subscription_table = Table('subscriptions', db.Model.metadata,
    Column('client_id', Integer, ForeignKey('clients.id')),
    Column('store_id', Integer, ForeignKey('stores.id'))
)

#---------------------------------------------------------------------
#-----------------------CART TABLE-----------------------
cart_table = Table('carts', db.Model.metadata,
    # Column('id', Integer, primary_key=True),
    Column('goods_service_id', Integer, ForeignKey('goods_services.id')),
    Column('client_id', Integer, ForeignKey('clients.id'))
)


#---------------------------------------------------------------------
#-----------------------CLASS StoreProfile-----------------------
class StoreProfile(db.Model, SerializerMixin):
    __tablename__= 'store_profiles'
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.String, default='Bio')
    location = db.Column(db.String, default='Location')
    phone_number = db.Column(db.String, unique=True)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    
    stores = db.relationship('Store', back_populates='store_profile', lazy=True)
    
    serialize_rules=('-stores.store_profile',)
    
    @validates('phone_number')
    def validate_phone_number(self, key, value):
        # Define a regex pattern for valid phone numbers
        pattern = re.compile(r'^[0-9()-]+$')

        if not pattern.match(value):
            raise ValueError("Invalid phone number format. Only numbers, hyphens, and parentheses are allowed.")

        return value


#---------------------------------------------------------------------
#-----------------------CLASS Store-----------------------
class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    code = db.Column(db.String, unique=True)
    


    #--------------- Many-to-Many relationship with Client
    subscribed_clients = db.relationship('Client', secondary=subscription_table, back_populates='subscribed_stores')

    # ---------------One-to-Many relationship with GoodsService
    goods_services = db.relationship('GoodsService', back_populates='store', lazy=True, cascade='all, delete-orphan')

    # ---------------One-to-Many relationship with Transaction
    transactions = db.relationship('Transaction', back_populates='store', lazy=True, cascade='all, delete-orphan')
    
    store_profile = db.relationship('StoreProfile', back_populates='stores', lazy=True, cascade='all, delete-orphan')
    
    

    serialize_rules = ('-store_profile.stores', '-goods_services.goods_carts', '-password_hash', '-transactions.store', '-subscribed_clients.subscribed_stores', '-goods_services.store', '-subscribed_clients.transactions', '-subscribed_clients.client_carts', '-transactions.client.client_carts')

    @hybrid_property
    def password_hash(self):
        # ensures user does not have access to password
        raise AttributeError("You don't have permission to view the password!")
    
    @password_hash.setter
    def password_hash(self, password):
        # generates hashed version of password
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        # check if inputted password matches user's password
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    
    # Validation: Ensure email is not empty and has a valid format
    @validates('email')
    def validates_email(self, key, email):
        if not email or '@' not in email:
            raise ValueError("Invalid email format")
        return email


#--------------------------------------------------------------------------------------------
#----------------- CLASS Client -----------------------
class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    
    # Many-to-Many relationship with Store
    subscribed_stores = db.relationship('Store', secondary=subscription_table, back_populates='subscribed_clients')
    
    # One-to-Many relationship with Transaction
    transactions = db.relationship('Transaction', back_populates='client', lazy=True, cascade='all, delete-orphan')
    
    client_carts = db.relationship('GoodsService', secondary=cart_table, back_populates='goods_carts')

    serialize_rules = ('-client_carts.store.transactions', '-transactions.store.subscribed_clients._password_hash', '-transactions.store._password_hash', '-client_carts.store._password_hash', '-subscribed_stores.store_profile', '-client_carts.store.store_profile', '-transactions.client','-client_carts.goods_carts', '-subscribed_stores.subscribed_clients', '-subscribed_stores.transactions', '-subscribed_stores.goods_services' )

    # Set the password using bcrypt
    @hybrid_property
    def password_hash(self):
        # ensures user does not have access to password
        raise AttributeError("You don't have permission to view the password!")
    
    @password_hash.setter
    def password_hash(self, password):
        # generates hashed version of password
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        # check if inputted password matches user's password
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    # Validation: Ensure email is not empty and has a valid format
    @validates('email')
    def validates_email(self, key, email):
        if not email or '@' not in email:
            raise ValueError("Invalid email format")
        return email
    
    
    
#--------------------------------------------------------------------------------------------    
#----------------- CLASS GoodsService -----------------------
class GoodsService(db.Model, SerializerMixin):
    __tablename__ = 'goods_services'
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))

    # Many-to-Many relationship with Store
    store = db.relationship('Store', back_populates='goods_services', lazy=True)
    
    goods_carts = db.relationship('Client', secondary=cart_table, back_populates='client_carts')
    
    # transactions = db.relationship('Transaction', back_populates='goods_services', lazy=True)
    
    serialize_rules = ('-store.store_profile', '-store.goods_services', '-goods_services.transactions', '-store.subscribed_clients', '-goods_carts.client_carts' )


#---------------------------------------------------------------------
#----------------- CLASS Transaction -----------------------
class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())
    goods_service_names = db.Column(db.String)

    # Foreign keys
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)

    # Relationships
    store = db.relationship('Store', back_populates='transactions', lazy=True)
    client = db.relationship('Client', back_populates='transactions', lazy=True)

    serialize_rules = ('-store.transactions', '-client.transactions', '-client.client_carts')
