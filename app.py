import os
import json
from flask import Flask, request, redirect, url_for, render_template
import requests
from dotenv import load_dotenv

# Chargement des variables d'environnement (.env)
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)

# Middleware pour analyser les corps des requêtes en JSON
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')  # Rendre la vue 'index.html' (remplace le code précédent)

# Route d'exemple pour tester la connexion à l'API
@app.route('/api/test', methods=['GET'])
def test():
    return json.dumps({"message": "Welcome to the API!"})  # Renvoie un message JSON (remplace le code précédent)

# Route pour envoyer des messages au serveur local accessible sur Internet
@app.route('/api/messages', methods=['POST'])
def send_message():
    if 'message' not in request.json:  # Vérifier la présence de 'message' dans le JSON de la requête
        return json.dumps({"error": "Missing message"}), 400
    
    try:
        response = requests.post(f"http://{os.environ['IP']}:{os.environ['PORT']}/messages", data=json.dumps({"message": request.json["message"]}))
        
        if response.status_code == 200:
            return json.dumps({"result": response.json()})
        else:
            return json.dumps({"error": "Une erreur est survenue lors de la communication avec le serveur local"}), 500
    
    except Exception as e:
        print("Erreur :", e)
        return json.dumps({"error": "Une erreur est survenue lors du traitement de la demande"}), 500

# Redirige automatiquement toutes les demandes vers la page 'index.html' (par défaut)
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    return redirect(url_for('index'))  # Rediriger vers la route '/' (remplace le code précédent)

# Démarrage de l'application Flask sur un port spécifique ou en mode debug
if __name__ == '__main__':
    app.run(host=os.environ['IP'], port=int(os.environ['PORT']))  # Correction : utiliser 'os.environ["IP"]' et 'int(os.environ["PORT"])' (remplace le code précédent)
