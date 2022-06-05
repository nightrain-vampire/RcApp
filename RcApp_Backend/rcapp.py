import base64
from email import charset
import time
from flask import Flask, request, jsonify, render_template
import json
import pymysql
import datetime
from flask_cors import CORS
import os
# from flask_cors import *
# CORS(app, supports_credentials=True)

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

#小程序校驗文件
@app.route('/O20z977J4L.txt')
def mini():
    # base_dir = os.path.dirname(__file__)
    # resp = make_response(open(os.path.join(base_dir, O20z977J4L.txt)).read())
    # resp.headers["Content-type"]="text/plan;charset=UTF-8"
    # return resp
    f = open("C:\\xampp\\htdocs\\RcApp_Backend\\O20z977J4L.txt",encoding = "utf-8")
    return f.read()
    f.close()


#用戶注冊
@app.route('/register', methods=['POST'])
def register():
    uid = eval(request.form.get('uid'))
    # username = eval(request.form.get('username'))
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
        sql = "insert into user (uid,leftvotes,lastvotetime) values (%s,%s,%s)"
        cur.execute(sql,(uid,10,dateti))
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
    # print(res)
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
    key = str(json.loads(request.form.get("key")))
    conn = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cur = conn.cursor()
    sql = "select leftvotes,lastvotetime from user where uid = %s"
    cur.execute(sql, key)
    temp = cur.fetchall()[0]
    # print(temp)
    conn.commit()
    left_votes = temp[0]
    last_time = str(temp[1])
    current_time = str(datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d'))
    # print(current_time)
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
    img_name = img.filename + 'jpg'
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
    cur.execute(sql,(info['uid'],info['rname'],info['details'], ImgUrl, 1, info['reason'], info['targetid']))   # 插入数据
    conn.commit()
    cur.close()
    conn.close()
    return 'success'


# 投票
@app.route('/vote', methods=['POST'])
def vote():
    id = request.form.get('card')
    # print(id)
    uid = request.form.get('votes')
    # print(uid)
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


# 以下是管理員界面
# 管理員登陸
@app.route('/login',methods=['GET','POST'])
def login():
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    post_data = request.get_json()
    response_object = {"status":"success"}
    name = post_data.get("username")
    pwd = post_data.get("password")
    
    # username = '123'
    # password = '1234'
    # print(username)
    
    sql = "select id from admin where username = %s and password = %s"
    cursor.execute(sql,[name,pwd])
    result = cursor.fetchall()
    db.commit()
    if result:
        response_object['code'] = 1
    else:
        response_object['code'] = 0
    db.close()
    return jsonify(response_object)

#查看所有用戶信息
@app.route('/user',methods=['GET','POST'])
def usera():
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select id,uid,leftvotes,lastvotetime from user"
    try:
        cursor.execute(sql)
        result = cursor.fetchall()
        db.commit()
        for i in range(len(result)):
            id = result[i][0]
            uid = result[i][1]
            leftvotes = result[i][2]
            lastvotetime = result[i][3]
            infos = {}
            infos['id'] = id
            infos['uid'] = uid
            infos['leftvotes'] = leftvotes
            infos['lastvotetime'] = lastvotetime
            data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

# # 通過id查找用戶信息
@app.route('/user/<id>',methods=['GET','POST'])
def user_by_id(id):
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select id,leftvotes from user where id = %s"
    try:
        cursor.execute(sql, [id])
        result = cursor.fetchall()
        db.commit()
        id = result[0][0]
        leftvotes = result[0][1]
        infos = {}
        infos['id'] = id
        infos['leftvotes'] = leftvotes
        data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

# #查看所有提名信息
@app.route('/nominate',methods=['GET','POST'])
def nominate():
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select id,userid,intro,votes,pic,state,reason,name from nominee"
    try:
        cursor.execute(sql)
        result = cursor.fetchall()
        db.commit()
        for i in range(len(result)):
            id = result[i][0]
            userid = result[i][1]
            intro = result[i][2]
            votes = result[i][3]
            pic = result[i][4].split(",")
            state = result[i][5]
            reason = result[i][6]
            name = result[i][7]
            infos = {}
            infos['id'] = id
            infos['userid'] = userid
            infos['intro'] = intro
            infos['votes'] = votes
            infos['pic'] = pic
            infos['state'] = state
            infos['reason'] = reason
            infos['name'] = name
            data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

# #通過id查找提名信息
@app.route('/nominate/<id>',methods=['GET','POST'])
def nominate_by_id(id):
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select id,intro,votes,state,reason,name from nominee where id = %s"
    try:
        cursor.execute(sql,[id])
        result = cursor.fetchall()
        db.commit()
        id = result[0][0]
        intro = result[0][1]
        votes = result[0][2]
        state = result[0][3]
        reason = result[0][4]
        name = result[0][5]
        infos = {}
        infos['id'] = id
        infos['intro'] = intro
        infos['votes'] = votes
        infos['state'] = state
        infos['reason'] = reason
        infos['name'] = name
        data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

# 通過id更新用戶信息
@app.route('/updateuser/<id>',methods=['GET','POST'])
def updateuser(id):
    post_data = request.get_json()
    response_object = {"status":"success"}
    leftvotes = post_data.get("leftvotes")
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "update user set leftvotes = %s where id = %s"
    try:
        cursor.execute(sql,[leftvotes,id])
        result = cursor.fetchall()
        db.commit()
        response_object['code'] = 1
    except:
        response_object['code'] = 2
        print("Not Found")
    db.close()
    return jsonify(response_object)

# 查看所有待審核的提名信息   
@app.route('/review',methods=['GET','POST'])
def review():
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select id,userid,intro,votes,pic,state,reason,name from nominee where state = %s"
    try:
        cursor.execute(sql, 1)
        result = cursor.fetchall()
        db.commit()
        for i in range(len(result)):
            id = result[i][0]
            userid = result[i][1]
            intro = result[i][2]
            votes = result[i][3]
            pic = result[i][4].split(",")
            state = result[i][5]
            reason = result[i][6]
            name = result[i][7]
            infos = {}
            infos['id'] = id
            infos['userid'] = userid
            infos['intro'] = intro
            infos['votes'] = votes
            infos['pic'] = pic
            infos['state'] = state
            infos['reason'] = reason
            infos['name'] = name
            data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

# 通過提名
@app.route('/agree/<id>',methods=['GET','POST'])
def agree(id):
    response_object = {"status":"success"}
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "update nominee set state = %s where id = %s"
    try:
        cursor.execute(sql,[2,id])
        result = cursor.fetchall()
        db.commit()
        response_object['code'] = 1
    except:
        response_object['code'] = 2
        print("Not Found")
    db.close()
    return jsonify(response_object)

# 拒絕提名
@app.route('/disagree/<id>',methods=['GET','POST'])
def disagree(id):
    response_object = {"status":"success"}
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "update nominee set state = %s where id = %s"
    try:
        cursor.execute(sql,[3,id])
        result = cursor.fetchall()
        db.commit()
        response_object['code'] = 1
    except:
        response_object['code'] = 2
        print("Not Found")
    db.close()
    return jsonify(response_object)

# 更新提名信息
@app.route('/updatenominate/<id>',methods=['GET','POST'])
def updatenominate(id):
    post_data = request.get_json()
    response_object = {"status":"success"}
    name = post_data.get("name")
    intro = post_data.get("intro")
    votes = post_data.get("votes")
    state = post_data.get("state")
    reason = post_data.get("reason")
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "update nominee set intro = %s,votes = %s,state = %s,reason = %s,name = %s where id = %s"
    try:
        cursor.execute(sql,[intro,votes,state,reason,name,id])
        result = cursor.fetchall()
        db.commit()
        response_object['code'] = 1
    except:
        response_object['code'] = 2
        print("Not Found")
    db.close()
    return jsonify(response_object)

#查看所有投票信息
@app.route('/votes',methods=['GET'])
def votes():
    response_object = {"status":"success"}
    response_object['code'] = 1
    data = []
    db = pymysql.connect(host=host, port=port, user=user, password=password, db=database, charset=charset)
    cursor = db.cursor()
    sql = "select votes.id, user.uid, votes.ip, nominee.name, votes.vote_time from user, votes, nominee where votes.Nomineeid = nominee.id and votes.userid = user.id"
    try:
        cursor.execute(sql)
        result = cursor.fetchall()
        db.commit()
        for i in range(len(result)):
            id = result[i][0]
            uid = result[i][1]
            ip = result[i][2]
            name = result[i][3]
            votetime = result[i][4]
            infos = {}
            infos['id'] = id
            infos['uid'] = uid
            infos['ip'] = ip
            infos['name'] = name
            infos['votetime'] = votetime
            data.append(infos)
        response_object['data'] = data
    except:
        print("Not Found")
    db.close()
    return jsonify(response_object)

@app.route('/117image',methods=['POST'])
def fudanimage():
    img = request.files.get('file')
    path = "C:\\xampp\\htdocs\\RcApp_Backend\\static\\117img\\"
    img_name = str(int(round(time.time()*1000)))
    file_path = path+img_name+'.jpg'
    gen_path = path+img_name+'.png'
    img.save(file_path)
    os.system('backgroundremover -i {} -o {}'.format(file_path,gen_path))
    return 'https://tuanyi.fudan.edu.cn/static/117img/'+img_name+'.png'

if __name__ == '__main__' : 
    app.run(host='0.0.0.0', port = 5000, debug = True)