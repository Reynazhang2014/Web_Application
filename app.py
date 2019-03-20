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
<<<<<<< HEAD
Base.prepare(db.engine, reflect=True)
print(Base.classes.keys())
# Save references to each table
city_rent_price=Base.classes.city_rent_price
stmt = db.session.query(city_rent_price).statement
df= pd.read_sql_query(stmt, db.session.bind)


=======
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples
def loadData():
    
    df=pd.read_csv("db/pricepersqft1.csv") 
    cities = pd.read_csv('./db/uscities.csv')
    df = pd.merge(df,cities,on = ['City','State'],how = 'left')
    df.drop(columns=['County_y'],inplace = True)
    df.rename(columns={'County_x':'County'},inplace = True)
    df=df.set_index(["City Code"
                    ,"City"
                    ,"Lat",
                    "Lon"
                    ,"Metro"
                    ,"County"
                    ,"State"
                    ,"Population Rank"
                    ,'Population'
                    ,'Density'])
    # statck the columns of year and month into one column 
    # and add a column to indicate month-year                
    df=df.stack().reset_index()
    df=df.rename(columns={"level_10":"month_year",0:"Price_Persq","Population Rank":"PopulationRank"})
    # separate month-year to two columns
    map_month_to_num = {'Jan':1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
    df["Month"]=df["month_year"].apply(lambda x: x[3:]).map(map_month_to_num)
    df["Year"]=df["month_year"].apply(lambda x: "20"+ x[:2]).astype(int)
    # filter out the year before 2012
    df= df[df['Year']>=2012]
    #df.fillna(0,inplace = True)
    df=df.drop(["month_year"],axis=1)
    return df

df=loadData() 
engine=create_engine("sqlite:///db.sqlite")
df.to_sql("pricepersqft",con=engine,if_exists="replace")
>>>>>>> f8362763e69bb5638b990fbf6b3bd36644533b4c

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/rent",methods=['GET','POST'])
def filterRent():
    print(request.data)
    tempdf=df
    print(tempdf.head())
    if request.data:
        filterdict = json.loads(request.data)
        for k,v in filterdict.items():
            tempdf=tempdf[tempdf[k].astype(str).str.upper()==v.upper()]
        return tempdf.to_json(orient='records')
    return jsonify([])

@app.route("/yearlypricepersqft",methods=['GET','POST'])
def yearlypricepersqft():
    tempdf2= df
    if request.data:
        filterdict = json.loads(request.data)

        tempdf2=tempdf2[tempdf2["Year"].astype(str).str.upper()== filterdict["Year"].upper()]

    ave_yearly_price=tempdf2.groupby(["City","Year","State"])[["Price_Persq","Lat","Lon"]]\
                            .agg({'Price_Persq':'mean','Lat':'first','Lon':'first'}).reset_index()\
                            .rename(columns={"Price_Persq":"AvePricePersq"})\
                            .sort_values(by="AvePricePersq",ascending=False)
    highest20=ave_yearly_price[:20]
    print(highest20)
    return(highest20.to_json(orient='records'))






 
if __name__ == "__main__":
    app.run(debug =True)
