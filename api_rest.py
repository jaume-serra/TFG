# coding: utf-8
import re
from flask import *
from flask import Blueprint, render_template, request, redirect, Response, session, url_for
from flask.json import load



apirest = Blueprint('apirest',__name__)



@apirest.route("/api/get_places", methods = ["GET"])
def get_places():
    """
    Retorna els llocs desitjats
    """
    args = request.args
    if(not "type" in args):
        return {"msg":"error"},400
    
    type_place = args.get("type")
    if(type_place != "parking" and type_place != "storage"):
        return {"msg":"error"},400

    places = [{ "id": '1', "type":"parking","title": "Apartament Jaume" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "30 m2", "preu": "40","img": ["/static/img/a1.jpg"],"lat": "41.790914", "long": "1.995634"},
                { "id": '2', "type":"storage","title": "Apartament Manel" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "150 m2","preu": "400","img": ["/static/img/a2.jpg"],"lat": "41.391205","long": "2.154107" }, 
                { "id": '24', "type":"storage","title": "Apartament Ramon" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "2000 m2","preu": "4000","img": ["/static/img/a3.jpg"],"lat": "41.390405","long": "2.154807" },
               
                { "id": '3', "type":"storage","title": "Apartament Ramon" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "240 m2","preu": "2000","img": ["/static/img/a3.jpg","/static/img/a1.jpg","/static/img/a3.jpg","/static/img/a2.jpg"],"lat": "41.390005","long": "2.154077" },
                { "id": '4', "type":"storage","title": "Apartament Joan" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "200 m2","preu": "1000","img": ["/static/img/a1.jpg","/static/img/a2.jpg","/static/img/a3.jpg"],"lat": "41.392205","long": "2.152007" },
                { "id": '5', "type":"parking","title": "Apartament asd" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "1300 m2","preu": "7000","img": ["/static/img/a2.jpg"],"lat": "41.398205","long": "2.151007" },

                { "id": '13', "type":"storage","title": "Apartament Adria" ,"description":"Lorem ipsum dolor sit amet, consectetur.","mides": "7000 m2","preu": "200","img": ["/static/img/a4.jpg"],"lat":"41.389205","long": "2.155007" }]

    response = []
    for place in places:
        if (place["type"] == type_place):
            response.append(place)
    content = {"msg": response}
    return content, 200



@apirest.route("/api/tokensignin", methods = ["POST"])
def identify_token():
    if(request.method == "POST"):
        data = json.loads(request.data.decode('utf8'))
        token = data['idtoken']
        profile = data['profile']
        try:
            
            #Falta cridar api google per verificar token i afegir a la sessio
            session['email'] = profile['ov']
            session['name']  = profile['UX']
            session['token']  = token

            content = {"msg": "correcte"}
            
            return content, 200
            
        except ValueError as error:
            print("Invalid token",error)
            content = {"msg": "error"}
            return content, 400
