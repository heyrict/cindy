BASEDIR = $(PWD)


.PHONY: schema

schema:
	# generate table schema
	python manage.py graphql_schema && \
	mv schema.json $(BASEDIR)/sui_hei/static/js/
	# re-generate js files
	cd $(BASEDIR)/sui_hei/static/js && \
	npm run relay
