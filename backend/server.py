import base64
from email import charset
from flask import Flask, request, jsonify
import json
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
        tmplist['img'] = temp[i][5].split(',')
        res[i] = tmplist
    print(res)
    return res


# 上传图片
@app.route('/uploadImg',methods=['POST'])
def uploadImg():
    img = request.files.get('file')
    path = "D:\\Term\\凌客工坊\\uis\\RcApp\\images\\"
    img_name = img.filename
    file_path = path + img_name
    img.save(file_path)
    return '../../../images/' + img_name


# 上传信息
@app.route('/uploadInfo',methods=['POST'])
def uploadInfo():
    info = json.loads(request.values.get('pinfo'))          # 获取前端传来的数据
    print(info)
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "insert into vote(uid,name,intro,votes,pic) values(%s,%s,%s,%s,%s)"
    ImgUrl = ','.join(info['pic'])
    cur.execute(sql,(info['rid'],info['username'],info['details'], 0, ImgUrl))   # 插入数据
    # 获取这条记录的主id
    vid = cur.lastrowid
    conn.commit()
    # 插入投票记录
    sql = "insert into recommend(vid,name,uid,contact) values(%s,%s,%s,%s)"
    cur.execute(sql,(vid,info['name'],info['uid'],info['contact']))
    conn.commit()
    cur.close()
    conn.close()
    return 'success'


# 投票
@app.route('/vote', methods=['POST'])
def vote():
    id = request.form.get('card')
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "update vote set votes = votes + 1 where id = %s"
    cur.execute(sql,id)
    conn.commit()
    cur.close()
    conn.close()
    return 'success'