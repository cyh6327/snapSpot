from flask import jsonify

def home():
    return jsonify({'message': 'Hello, World!'})