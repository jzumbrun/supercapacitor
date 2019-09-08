help:
	@echo ""
	@echo "Welcome to Supercapacitor's build command center"
	@echo "----------------------------------------"
	@echo ""
	@echo "help                  Show this list"
	@echo "install               Install npm deps"
	@echo ""
	@echo "pack"
	@echo "     pack/publish     Pack the client for production"
	@echo "     pack/dev         Pack the client for development and watch files"
	@echo ""
	@echo "code"
	@echo "     code/test        Pack the client for production"
	@echo ""

install:
	@echo 'Installing...'
	@npm ci

pack/publish:
	@echo 'Packing production...'
	@webpack --env=production
	@npm publish

pack/dev:
	@echo 'Packing development...'
	@webpack --env=development -w

code/test:
	@mocha --require @babel/register
