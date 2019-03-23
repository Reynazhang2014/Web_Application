import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import json
app=Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/data.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db = SQLAlchemy(app)

# # reflect an existing database into a new model
Base = automap_base()
# # reflect the tables
Base.prepare(db.engine, reflect=True)
#print(Base.classes.keys())
# Save references to each table
city_rent_price=Base.classes.city_rent_price
stmt = db.session.query(city_rent_price).limit(10000).statement
df= pd.read_sql_query(stmt, db.session.bind)
print("=======================")

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/monthlyrent",methods=['GET','POST'])
def filterRent():
    print("=======================")
    print(request.data)
    print("=======================")
    tempdf=df
    ave_yearly_price=tempdf.groupby(["City","Year","State","County","Metro"])[["Price_Persq","Price_Total","Lat","Lon","Density","Population","PopulationRank","HappiestRank"]]\
                            .agg({'Price_Persq':'mean','Price_Total':'mean',\
                                'Lat':'first','Lon':'first',"Density":'first',\
                                "Population":'first',"PopulationRank":'first',"HappiestRank":"first"})\
                            .reset_index()\
                            .rename(columns={"Price_Persq":"AvePricePersq","Price_Total":"AvePriceTotal"})\
                            .sort_values(by="AvePricePersq",ascending=False)
    # print(tempdf.head(10))
    if request.data:
        filterdict = json.loads(request.data)
        print(filterdict)
        for k,v in filterdict.items():
            
            if k == 'maxRent':
                ave_yearly_price = ave_yearly_price[ave_yearly_price['AvePriceTotal'] <= float(v)]
                print(ave_yearly_price['AvePriceTotal'].head())
            elif k == 'minRent':
                ave_yearly_price = ave_yearly_price[ave_yearly_price['AvePriceTotal'] >= float(v)]
            else:
                ave_yearly_price=ave_yearly_price[ave_yearly_price[k].astype(str).str.upper()==v.upper()]
        print(ave_yearly_price)
    return ave_yearly_price.to_json(orient='records')

@app.route("/yearlyrent",methods=['GET','POST'])
def yearlyrent():
    tempdf2= df
    if request.data:
        filterdict = json.loads(request.data)

        tempdf2=tempdf2[tempdf2["Year"].astype(str).str.upper()== filterdict["Year"].upper()]

    ave_yearly_price=tempdf2.groupby(["City","Year","State","County","Metro"])[["Price_Persq","Price_Total","Lat","Lon","Density","Population","PopulationRank","HappiestRank"]]\
                            .agg({'Price_Persq':'mean','Price_Total':'mean',\
                                'Lat':'first','Lon':'first',"Density":'first',\
                                "Population":'first',"PopulationRank":'first',"HappiestRank":"first"})\
                            .reset_index()\
                            .rename(columns={"Price_Persq":"AvePricePersq","Price_Total":"AvePriceTotal"})\
                            .sort_values(by="AvePricePersq",ascending=False)
    highest20=ave_yearly_price[:20]
    #print(highest20)
    return(highest20.to_json(orient='records'))

@app.route("/happinessvsrent",methods=['GET','POST'])
def happinessvsrent():
    tempdf= df
    if request.data:
        filterdict = json.loads(request.data)

        tempdf= tempdf[tempdf["Year"].astype(str).str.upper()== filterdict["Year"].upper()]

    tempdf2= tempdf.groupby(["City","Year","State","County","Metro"])[["Price_Persq","Price_Total","Lat","Lon","Density","Population","PopulationRank","HappiestRank"]]\
                            .agg({'Price_Persq':'mean','Price_Total':'mean',\
                                'Lat':'first','Lon':'first',"Density":'first',\
                                "Population":'first',"PopulationRank":'first',"HappiestRank":"first"})\
                            .reset_index()\
                            .rename(columns={"Price_Persq":"AvePricePersq","Price_Total":"AvePriceTotal"})
    tempdf2.fillna(0,inplace = True)                       

    happinessvsrent={"happiest":tempdf2.sort_values(by="HappiestRank",ascending=False)[:20].to_dict('records'),\
                     "highest10":tempdf2.sort_values(by="AvePricePersq",ascending=False)[:20].to_dict('records'),\
                     "lowest10":tempdf2.sort_values(by="AvePricePersq",ascending=True)[:20].to_dict('records')}
   
    
    #print(happinessvsrent)

    return jsonify(happinessvsrent) 
   
if __name__ == "__main__":
    app.run(debug =True)
