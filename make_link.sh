dir=`dirname $0`
ORIGIN_ROOT=$(realpath $dir)
CONFIG_ROOT=$(realpath ~/.config/atcoder-cli-nodejs)

function def(){
  ln -s $ORIGIN_ROOT/$1 $CONFIG_ROOT/$1
}
mkdir -p ~/.config/atcoder-cli-nodejs/python
def config.json
def python/main.py
def python/template.json
