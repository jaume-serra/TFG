# -*- coding: utf-8 -*-
from flask import *
from flask import Blueprint, render_template, request, redirect, Response, session, url_for
from datetime import timedelta
import datetime
import functools
import random

from flask.sessions import SessionInterface




app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['PERMANENT_SESSION_LIFETIME'] =  timedelta(minutes=10)


@app.route("/llistat")
def llistat_mapa():
    return render_template('mapa.html')



@app.route("/")
def index():
    return render_template('index.html')


@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/logout")
def logout():
  #  del(session)

    if(session['token']):
        request.post('https://oauth2.googleapis.com/revoke',
        params={'token': session['token']},
        headers = {'content-type': 'application/x-www-form-urlencoded'})
        
    session.clear()

    return redirect("/")


