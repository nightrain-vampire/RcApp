from email import charset
from flask import Flask, request, jsonify
import pymysql

user = 'root'
password = ''
database = 'rcapp'
charset = 'utf8'
host = '127.0.0.1'
port = 3316         # 连不上的话可以康康端口号对不对

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>Hello World!</h1>'


# 获得已提名人的信息(按得票数降序排列)
@app.route('/getvotes', methods=['POST'])
def getvotes():
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from vote order by votes desc"
    cur.execute(sql)
    temp = cur.fetchall()
    # print(temp[1][1])
    cur.close()
    conn.close()
    # 构建返回值
    res = {}
    for i in range(len(temp)):
        tmplist = {}
        tmplist['id'] = temp[i][0]
        tmplist['uid'] = temp[i][1]
        tmplist['name'] = temp[i][2]
        tmplist['intro'] = temp[i][3]
        tmplist['votes'] = temp[i][4]
        tmplist['img'] = temp[i][5]
        res[i] = tmplist
    return res