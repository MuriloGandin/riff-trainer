from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/tab", methods=["POST"])
def tab():
    tabs = {
        "alternate": "options space=20 tab-stems=true \n tabstave time=4/4 \n notes =|: :8$.top.$ 5/6 $∏$ 6/6$V$ 7/6$∏$ 8/5$V$ 5/6$∏$ 6/6$V$ 7/5$∏$ 8/6$V$ | 5/6 $∏$ 6/5$V$ 7/6$∏$ 8/6$V$ 5/5$∏$ 6/6$V$ 7/6$∏$ 8/6$V$ =:| \n options space=30",
        "sweep": "options space=20 tab-stems=true \n tabstave time=3/4 \n notes =|: :8$.top.$ 10/5$∏$ 9/4$∏$ 8/3$∏$ 7/2$V$ 8/3$V$ 9/4$V$ =:| \n options space=30",
        "spider": "options space=20 tab-stems=true \n tabstave time=4/4 \n notes :8 5-7-6-8/6 5-6-7-8/5|5-7-6-8/4 5-6-7-8/3|5-7-6-8/2 5-6-7-8/1 \n tabstave time=4/4 \n notes :8 5-7-6-8/1 5-6-7-8/2|5-7-6-8/3 5-6-7-8/4|5-7-6-8/5 5-6-7-8/6 \n options space=20"
    }
    chosen = request.form.get("tab")
    selected = tabs[chosen]
    return render_template("tab.html", tab=selected, exercise=chosen)


if __name__ == "__main__":
    app.run(debug=True)