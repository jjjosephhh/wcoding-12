from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

recipes = []

@app.route('/recipes', methods=['GET'])
def get_recipes():
    return jsonify({
        'ok': True,
        'recipes': recipes,
    })

@app.route('/recipes', methods=['POST'])
def create_recipe():
    recipe = request.get_json()
    recipe['id'] = str(uuid.uuid4())
    recipes.append(recipe)
    return jsonify({
        'ok': True,
        'recipes': recipes,
    })

@app.route('/recipes/<string:id>', methods=['DELETE'])
def delete_recipe(id):
    global recipes
    recipes = [r for r in recipes if r['id'] != id]
    return jsonify({
        'ok': True,
        'recipes': recipes,
    })

#@app.route('/recipes/<id:int>', methods=['PUT'])
#def get_recipes(id):
#    recipe = request.get_json()
#    for r
#    return jsonify({
#        'ok': True,
#        'recipes': recipes,
#    })

if __name__ == '__main__':
    app.run('0.0.0.0', port=5001, debug=True)