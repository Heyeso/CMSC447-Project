from flask import Flask
from flask.helpers import send_from_directory

app = Flask(__name__, static_folder='../client/build', static_url_path="")

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, "index.html")

# Test API route
@app.route("/test")
def test():
    return {'msg': 'Test is working as expected', "status": 200}


if __name__ == '__main__':
    app.run(debug=True)
