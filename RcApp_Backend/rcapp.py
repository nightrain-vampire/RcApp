import base64
from email import charset
import time
from flask import Flask, request, jsonify, render_template
import json
import pymysql
import datetime
from flask_cors import CORS

user = 'root'
password = ''
database = 'rcapp'
charset = 'utf8'
host = '127.0.0.1'
port = 3306         # 连不上的话可以康康端口号对不对

app = Flask(__name__)
CORS(app)
Nominee_State = ['草稿', '待审核', '已通过', '已拒绝']

@app.route('/')
def index():
    return '<h1>Hello World!</h1>'
#uis界面
@app.route('/uis')
def uis():
    return render_template('oauth.html')

#用戶注冊
@app.route('/register', methods=['POST'])
def register():
    uid = eval(request.form.get('uid'))
    username = eval(request.form.get('username'))
    dateti = datetime.date.today()
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from user where uid = %s"
    cur.execute(sql,uid)
    temp = cur.fetchall()
    cur.close()
    conn.close()
    if temp:
        return 'success'
    else:
        conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
        cur = conn.cursor()
        sql = "insert into user (name,uid,leftvotes,lastvotetime) values (%s,%s,%s,%s)"
        cur.execute(sql,(username,uid,10,dateti))
        conn.commit()
        cur.close()
        conn.close()
        return 'success'


# 获得已提名人的信息(按得票数降序排列)
@app.route('/getvotes', methods=['POST'])
def getvotes():
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from nominee where state = 2 order by votes desc"
    cur.execute(sql)
    temp = cur.fetchall()
    # print(temp[1][1])
    cur.close()
    conn.close()
    # 构建返回值
    res = []
    for i in range(len(temp)):
        tmplist = {}
        tmplist['id'] = temp[i][0]
        # tmplist['uid'] = temp[i][1]
        tmplist['name'] = temp[i][2]
        tmplist['intro'] = temp[i][3]
        tmplist['votes'] = temp[i][4]
        tmplist['img'] = temp[i][5].split(',')
        tmplist['reason'] = temp[i][7]
        res.append(tmplist)
    return jsonify(res)


# 获取某个用户的所有提名
@app.route('/getmyvotes', methods=['POST'])
def getmyvotes():
    userid = request.form.get('id')
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from nominee where userid = %s"
    cur.execute(sql,userid)
    temp = cur.fetchall()
    cur.close()
    conn.close()
    res = []
    for i in range(len(temp)):
        tmplist = {}
        tmplist['id'] = temp[i][0]
        tmplist['name'] = temp[i][2]
        tmplist['intro'] = temp[i][3]
        tmplist['votes'] = temp[i][4]
        tmplist['img'] = temp[i][5].split(',')
        tmplist['state'] = Nominee_State[int(temp[i][6])]
        res.append(tmplist)
    print(res)
    return jsonify(res)


# 获取当前要修改的人的信息
@app.route('/getcurrent', methods=['POST'])
def getcurrent():
    id = request.form.get('id')
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from nominee where id = %s"
    cur.execute(sql,id)
    temp = cur.fetchall()
    print(temp)
    cur.close()
    conn.close()
    res = {}
    res['id'] = temp[0][0]
    res['name'] = temp[0][2]
    res['intro'] = temp[0][3]
    res['votes'] = temp[0][4]
    res['img'] = temp[0][5].split(',')
    res['reason'] = temp[0][7]
    return jsonify(res)
    

# 获取剩余票数
@app.route('/getleft', methods=['POST'])
def getLeft():
    key = str(json.loads(request.values.get("key")))
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select leftvotes,lastvotetime from user where uid = %s"
    cur.execute(sql, key)
    temp = cur.fetchall()[0]
    print(temp)
    conn.commit()
    left_votes = temp[0]
    last_time = str(temp[1])
    current_time = str(datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d'))
    print(current_time)
    # 如果上一次投票时间是昨天或者更早，刷新剩余票数
    if current_time > last_time:
        sql = "update user set leftvotes = 10 where uid = %s"
        cur.execute(sql, key)
        conn.commit()
        left_votes = 10
    cur.close()
    conn.close()
    return jsonify({'leftvotes': left_votes})


# 上传图片
@app.route('/uploadImg',methods=['POST'])
def uploadImg():
    img = request.files.get('file')
    # path = "D:\\Term\\凌客工坊\\uis\\RcApp\\images\\"
    path = "C:\\xampp\\htdocs\\RcApp_Backend\\static\\"
    img_name = img.filename
    print("圖片名字"+img_name)
    file_path = path + img_name
    img.save(file_path)
    # return '../../../images/' + img_name
    return 'https://tuanyi.fudan.edu.cn/static/' + img_name


# 上传信息
@app.route('/uploadInfo',methods=['POST'])
def uploadInfo():
    info = json.loads(request.values.get('pinfo'))        # 获取前端传来的数据
    # pinfo = json.loads(request.values.get('pinfo'))
    # print(pinfo)
    print(info)
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "insert into nominee(userid,name,intro,votes,pic,state,reason) values(%s,%s,%s,%s,%s,%s,%s)"
    ImgUrl = ','.join(info['pic'])
    cur.execute(sql,(info['uid'],info['rname'],info['details'], 0, ImgUrl, 1, info['reason']))   # 插入数据
    conn.commit()
    cur.close()
    conn.close()
    return 'success'


# 修改信息
@app.route('/editInfo',methods=['POST'])
def editInfo():
    info = json.loads(request.values.get('pinfo'))          # 获取前端传来的数据
    # print(info)
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "update nominee set userid=%s,name=%s,intro=%s,pic=%s,state=%s,reason=%s where id=%s"
    ImgUrl = ','.join(info['pic'])
    cur.execute(sql,(info['userid'],info['rname'],info['details'], ImgUrl, 1, info['reason'], info['targetid']))   # 插入数据
    conn.commit()
    cur.close()
    conn.close()
    return 'success'


# 投票
@app.route('/vote', methods=['POST'])
def vote():
    id = request.form.get('card')
    uid = request.form.get('votes')
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    # 更新票数
    sql = "update nominee set votes = votes + 1 where id = %s"
    cur.execute(sql,id)
    conn.commit()
    # 更新投票记录
    sql = "insert into votes(userid,ip,Nomineeid,vote_time) values(%s,%s,%s,%s)"
    coolection_time = datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S')
    cur.execute(sql,(uid,request.remote_addr,id,coolection_time))
    conn.commit()
    # 更新剩余票数和最后投票时间
    lastvote_time = datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d')
    sql = "update user set leftvotes = leftvotes - 1, lastvotetime = %s where uid = %s"
    cur.execute(sql, (lastvote_time,uid))
    conn.commit()
    cur.close()
    conn.close()
    return 'success'


# 搜索
@app.route('/searchkey', methods=['POST'])
def search():
    key = request.form.get('key')
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select * from nominee where name = %s and state = 2 order by votes desc"
    cur.execute(sql, key)
    temp = cur.fetchall()
    cur.close()
    conn.close()
    res = []
    for i in range(len(temp)):
        tmplist = {}
        tmplist['id'] = temp[i][0]
        # tmplist['uid'] = temp[i][1]
        tmplist['name'] = temp[i][2]
        tmplist['intro'] = temp[i][3]
        tmplist['votes'] = temp[i][4]
        tmplist['img'] = temp[i][5].split(',')
        res.append(tmplist)
    print(res)
    return jsonify(res)

if __name__ == '__main__' : 
    app.run(host='0.0.0.0', port = 5000, debug = True)