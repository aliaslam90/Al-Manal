import os,json,uuid,urllib.request,urllib.error,datetime
base=os.environ['BOOKING_TEST_URL'].rstrip('/')
origin=base
payload=dict(name="Integration O'Connor",email='test@example.com',phone='+971501234567',service='Veneers',doctor='Dr. Manal Dandan',date=(datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=4)))+datetime.timedelta(days=1)).date().isoformat(),time='11:30',notes='<script>test only</script>',request_id=str(uuid.uuid4()))
def request(data=payload,origin=origin,content_type='application/json',method='POST'):
    raw=data if isinstance(data,bytes) else json.dumps(data).encode()
    req=urllib.request.Request(base+'/api/bookings.php',data=raw if method=='POST' else None,headers={'Content-Type':content_type,'Origin':origin},method=method)
    try:
        with urllib.request.urlopen(req) as r:return r.status,json.load(r)
    except urllib.error.HTTPError as e:return e.code,json.load(e)
status,body=request();assert status==201,(status,body);reference=body['reference']
assert request()[1]['reference']==reference
changed=payload|{'notes':'changed'};assert request(changed)[0]==409
assert request(payload|{'doctor':'Unknown','request_id':str(uuid.uuid4())})[0]==422
assert request(origin='https://elsewhere.example')[0]==403
assert request(data=b'{bad')[0]==400
assert request(content_type='text/plain')[0]==415
assert request(data=b'x'*17000)[0]==413
assert request(method='GET')[0]==405
for _ in range(11): status,_=request()
assert status==429,status
print('API checks passed: persistence acknowledgement, retry, conflict, validation, origin, body limits, method and rate limiting.')
