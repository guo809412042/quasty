REPO = http://gitlab.quvideo.com/WEB/vcm-quality-system.git

DING_TALK = https://open.feishu.cn/open-apis/bot/hook/99a616ff287b4394ac9c13576a06cd83
HOOK_ENV = production

PROJ_TESTS = $(shell find test -type f -name "*.test.js")
PROJ_PATH = $(shell pwd)
PROJ_BIN = ./node_modules/.bin/
PROJ_NAME = quality

BUILD_COPY = src config
BUILD_OUT = dist/

CONF_MAX_OLD_SPACE_SIZE = 6000
CONF_REGISTRY_URL = https://registry.xnpm.quvideo.com
CONF_REGISTRY = --registry=$(CONF_REGISTRY_URL)


# 初始化项目
init: clean
	@echo 'NPM install (dev) ...'
	@npm i $(CONF_REGISTRY)
	@echo 'NPM (dev) Done .'

# 检查js代码规范
eslint:
	@$(PROJ_BIN)eslint .
	@echo 'ESLint Done , Congratulations, you have no mistakes .'

# 格式化代码
pretty:
	@$(PROJ_BIN)prettier --single-quote --trailing-comma es5 --write src/**/*.{js,jsx} src/**/**/*.{js,jsx} src/**/**/**/*.{js,jsx}
	@$(PROJ_BIN)eslint --fix src/**/*.{js,jsx} src/**/**/*.{js,jsx} src/**/**/**/*.{js,jsx} --quiet

# 初始化 git
gitinit:
	@echo '确保你的项目是第一次初始化 git ...'
	-rm -rf .git/
	@git init
	-git remote rm origin
	@git remote add origin $(REPO)
	@echo 'Done .'

# 查看git提交日志
log:
	@git log --pretty=format:%s

dev:
	@npx webpack-dev-server --config config/webpack.dev.js

build:
	-rm -rf dist/
	@BUILD_ENV=production npx webpack --config config/webpack.prod.js --mode production

upload-dev:
	@npx f2e-uploader -d dev/vcm/$(PROJ_NAME)/dist -l dist -p

upload-daily:
	@npx f2e-uploader -d daily/vcm/$(PROJ_NAME)/dist -l dist -p

upload-prod:
	@npx f2e-uploader -d prod/vcm/$(PROJ_NAME)/dist -l dist -p

publish-hook:
	@curl -H "Content-Type: application/json" -d "{\"title\": \"vcm前端部署\", \"text\": \"发布 $(PROJ_NAME) 到 $(HOOK_ENV) 环境 \"}" $(DING_TALK)

# 生成 changelog -w -r 0
changelog:
	@$(PROJ_BIN)conventional-changelog -p angular -i CHANGELOG.md -s
