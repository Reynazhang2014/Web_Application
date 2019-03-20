import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session


##############################################################################################
# define the cleaning table function
map_month_to_num = {'Jan':1, 
                    'Feb':2, 
                    'Mar':3, 
                    'Apr':4, 
                    'May':5,
                    'Jun':6,
                    'Jul':7,
                    'Aug':8,
                    'Sep':9,
                    'Oct':10,
                    'Nov':11,
                    'Dec':12}
 
pricepersq = pd.read_csv('./db/pricepersqft1.csv')
price = pd.read_csv('./db/price.csv')
cities = pd.read_csv('./db/uscities.csv')
happy = pd.read_excel('./db/happiest_cities.xlsx')
price.set_index(['City Code','City','Lat','Lon','Metro','County','State','Population Rank'],inplace = True)
pricenew1 = price.stack(dropna = False).reset_index() 
merged = pd.merge(pricepersq,cities,on = ['City','State'],how = 'left')
merged.drop(columns=['County_y'],inplace = True)
merged.rename(columns={'County_x':'County'},inplace = True)
# statck the columns of year and month into one column and add a column to indicate month-year
merged.set_index(['City Code','City','Lat','Lon','Metro','County','State','Population Rank','Population','Density'],inplace = True)
pricenew = merged.stack(dropna = False).reset_index() #pricenew is the price_per_sq table
pricenew1.rename(columns={'level_8':'month_year',0:'price'},inplace = True) #pricenew1 is the price_total table
#stack columns for price per square feet
pricenew1['month'] = pricenew1['month_year'].apply(lambda x: x[:3]).map(map_month_to_num)
pricenew1['year'] = pricenew1['month_year'].apply(lambda x: '20' + x[4:]).astype(int)
pricenew1.replace(np.nan,0,inplace = True) 

# separate month-year to two columns
pricenew.rename(columns={'level_10':'month_year',0:'price_persq'},inplace = True)
pricenew['month'] = pricenew['month_year'].apply(lambda x: x[3:]).map(map_month_to_num)
pricenew['year'] = pricenew['month_year'].apply(lambda x: '20' + x[:2]).astype(int)
pricenew.replace(np.nan,0,inplace = True) 
#print(price_tot.head())
price_tot = pricenew1[['City Code','price','month','year']]
price_agg = pd.merge(price_tot,pricenew, on = ['City Code','month','year'],how = 'left' )


# filter out the year before 2012
df1 = price_agg[price_agg['year']>=2012]
df1 = df1[['City Code','City','Metro','County','State','Lat','Lon','Population Rank',
        'Population','Density','month','year','price_persq','price']].rename(columns = {'City Code':'CityCode',
                                                                         'Population Rank': 'PopulationRank',
                                                                        'price':'Price_Total',
                                                                        'price_persq':'Price_Persq',
                                                                        'month':'Month',
                                                                        'year':'Year'})
#df.fillna(0,inplace = True)
##############################################################################################
#merge with the happiest cities ranking dat
happy = pd.read_excel('./db/happiest_cities.xlsx')
happy.rename(columns = {'City':'City_St'},inplace = True)
happy['City'] = happy['City_St'].str.split(', ').apply(lambda x: x[0])
happy['State'] = happy['City_St'].str.split(', ').apply(lambda x: x[1])
happy = happy[['Total Score','City','State']].rename(columns = {'Total Score':'HappiestRank'})
df = pd.merge(df1,happy, on = ['City','State'], how = 'left')

#store date frame to sqlite
engine=create_engine("sqlite:///db/data.sqlite")

#delete table if exists
sql = 'DROP TABLE IF EXISTS city_rent_price;'
result = engine.execute(sql)

#create city_rent_table with primary key being the index column
city_rent_table='''CREATE TABLE  city_rent_price ("index" BIGINT AUTO_INCREMENT PRIMARY KEY, 
                                            "CityCode" BIGINT, 
                                            "City" TEXT, 
                                            "Metro" TEXT, 
                                            "County" TEXT, 
                                            "State" TEXT, 
                                            "Lat" FLOAT, 
                                            "Lon" FLOAT, 
                                            "PopulationRank" BIGINT, 
                                            "Population" BIGINt,
                                            "Density" BIGINT,
                                            "Month" BIGINT, 
                                            "Year" BIGINT,
                                            "Price_Persq" FLOAT,
                                            "Price_Total" FLOAT,
                                            "HappiestRank" FLOAT
                                            );
                                            '''
engine.execute(city_rent_table)

#append the dataframe to the city_rent_table
df.to_sql("city_rent_price",con=engine,if_exists="append")

#check if the data is saved properly
#print(engine.execute("SELECT * FROM city_rent_price").limit(2000))

##############################################################################################

