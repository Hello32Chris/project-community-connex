#!/usr/bin/env python3

from models import Client, Store, GoodsService, Transaction, subscription_table, cart
# Remote library imports

# Local imports
from app import app
from config import db, bcrypt
import random
import string

def generate_store_code():
    return ''.join(random.choices(string.ascii_uppercase, k=5))

def generate_unique_store_code():
    while True:
        new_store_code = generate_store_code()
        existing_store = Store.query.filter_by(code=new_store_code).first()
        if not existing_store:
            return new_store_code


with app.app_context():
    print("\nStarting seed...\n")
    print('Refreshing Tables...\n')

    Client.query.delete()
    Store.query.delete()
    GoodsService.query.delete()
    Transaction.query.delete()
    
    db.session.execute(subscription_table.delete())
    db.session.commit()
    
    db.session.execute(cart.delete())
    db.session.commit()




    print('Seeding stores...\n')
    
    new_store = Store(
        id = 1,
        name="CarWashers", 
        email="CarWashers@business.com",
        code= generate_unique_store_code(),
    )
    new_store.password_hash = '123'
    new_store2 = Store(
        id = 2,
        name="DogWalker", 
        email="DogWalker@business.com",
        code= generate_unique_store_code() 
    )
    new_store2.password_hash = '123'
    new_store3 = Store(
        id = 3,
        name="Kiki's Delivery Service", 
        email="Kikispointyhat@business.com",
        code= generate_unique_store_code() 
    )
    new_store3.password_hash = '123'
    new_store4 = Store(
        id = 4,
        name="Massage", 
        email="Massages@business.com",
        code= generate_unique_store_code() 
    )
    new_store4.password_hash = '123'
    
    print('seeding goods n services...\n')

    new_goods_service = GoodsService(
        name = "Full Wash - Inside/Out",
        price = 60,
        store_id = 1
    )
    
    db.session.add(new_store)
    db.session.commit()
    
    db.session.add(new_store2)
    db.session.commit()
    
    db.session.add(new_store3)
    db.session.commit()
    
    db.session.add(new_store4)
    db.session.commit()
    
    
    
    print('seeding transactions....\n')

    new_transaction = Transaction(
        total_amount=32.50,
        store_id=1,
        client_id=1
    )
    # new_transaction.goods_services.append(new_goods_service)
    
    print('seeding clients...\n')

    new_client = Client(
        id=1,
        name="Joseph Smith", 
        email="Joe@youmail.com",     
        )
    new_client.password_hash = '123'
    
    print('Hashed passwords AND added subscriptions...\n')
    
    # new_client.subscribed_stores.append(new_store)
    # new_client.subscribed_stores.append(new_store2)
    
    
    new_client2 = Client(
        id=2,
        name="Jack Sparrow", 
        email="YoHo@youmail.com"
        )
    new_client2.password_hash = '123'
    
    new_client3 = Client(
        id=3,
        name="Alicia Jones", 
        email="Alicia@youmail.com"
        )
    new_client3.password_hash = '123'
    
    
    
    
    # Adding the client to the session
    db.session.add(new_client)
    db.session.commit()
    
    db.session.add(new_client2)
    db.session.commit()
    
    db.session.add(new_client3)
    db.session.commit()
    
    db.session.add(new_goods_service)
    db.session.commit()
    
    db.session.add(new_transaction)
    db.session.commit()
    

    # Committing the changes to the database
    print('Done with seeding...\n\n')