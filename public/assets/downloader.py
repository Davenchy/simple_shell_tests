import requests
import json
from os import path, makedirs

with open("tasks.json", "r") as file:
    bytes = file.read()
    tasks = json.loads(bytes)

def download_file(url, fullpath):
    print(f"downloading file to {fullpath}")
    makedirs(path.dirname(fullpath), exist_ok=True)
    res = requests.get(url, allow_redirects=True)
    print(f"state: {res.ok}, code: {res.status_code}")
    if not res.ok:
        return
    with open(fullpath, "wb") as file:
        file.write(res.content)

# print(json.dumps(tasks[4], indent=2))
for taskid, task in enumerate(tasks):
    print(f"task: {task['correction']['title']}")
    corr = task['correction']
    if "checks" in corr:
        for checkid, check in enumerate(corr['checks']):
            if "files" in check:
                for file in check["files"]:
                    fullpath = file["name"]
                    fullpath = path.join(
                        "files", str(taskid), str(checkid), fullpath)
                    fullpath = path.realpath(fullpath)
                    download_file(file['url'], fullpath)
    
