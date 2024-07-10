dir=`dirname $0`
ORIGIN_ROOT=$(realpath $dir/config)
CONFIG_ROOT=$(realpath ~/.config/atcoder-cli-nodejs)

function def(){
  cp -s $ORIGIN_ROOT/$1 $CONFIG_ROOT/$1
}
rm -rf ~/.config/atcoder-cli-nodejs/
mkdir -p ~/.config/atcoder-cli-nodejs/python
def config.json
def python/main.py
def python/template.json
