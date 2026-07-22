from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.shortcuts import HttpResponse,render,redirect
import pandas as pd
import webbrowser
import pandas as pd
from django.shortcuts import render
from django.http import HttpResponseBadRequest
def login(request):
    return render(request, 'index.html')
def map_demo(request):
    # 加上 'taxi/' 前缀，告诉 Django 去 taxi 这个应用的文件夹里找
    return render(request, 'map_demo.html')
def UTC(request):
    return redirect('https://www.matools.com/timestamp?embed')
def map(request):
    return render(request, "map.html")
def _load_taxi_data():
    """统一加载 CSV（缓存思路）"""
    csv_path = r'./static/data/0912_view.csv'  # ⚠️ 后期改成绝对路径
    return pd.read_csv(csv_path, encoding='utf-8')


def relay2(request):
    try:
        star = request.GET.get('StartTime')
        end = request.GET.get('EndTime')

        if not star or not end:
            return HttpResponseBadRequest("起始时间和终止时间不能为空")

        StartTime = int(star)
        EndTime = int(end)
    except (TypeError, ValueError):
        return HttpResponseBadRequest("时间参数必须是数字")

    data = _load_taxi_data()
    dta = data[(data['UTC'] >= StartTime) & (data['UTC'] <= EndTime)]

    if dta.empty:
        return render(request, 'View.html', {"aa": []})

    car = dta.iloc[:, [0, 2, 3]].rename(
        columns={0: 'name', 2: 'lat', 3: 'lng'}
    ).to_dict('records')

    return render(request, 'View.html', {"aa": car})


def relay3(request):

    try:
        star = request.GET.get('StartTime')
        end = request.GET.get('EndTime')
        car_id = request.GET.get('CarId')

        if not star or not end or not car_id:
            return HttpResponseBadRequest("参数不能为空")

        StartTime = int(star)
        EndTime = int(end)
        CarID = int(car_id)
    except (TypeError, ValueError):
        return HttpResponseBadRequest("参数必须是数字")

    data = _load_taxi_data()
    data = data[data['CarId'] == CarID]
    dta = data[(data['UTC'] >= StartTime) & (data['UTC'] <= EndTime)]

    if dta.empty:
        return render(request, 'Dynamic.html', {"aa": []})

    car = dta.iloc[:, [0, 1, 2, 3]].rename(
        columns={0: 'name', 1: 'UTC', 2: 'lat', 3: 'lng'}
    ).to_dict('records')


    return render(request, 'Dynamic.html', {"aa": car})
def fx(request):
    return redirect('/relay5/')
def fx1(request):
    return render(request, 'index_fx.html')