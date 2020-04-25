VERSION=$(shell cat VERSION)

docker-build:
	docker build --build-arg VUE_APP_BASE_API=$(VUE_APP_BASE_API) -t leeif/pluto-admin:$(VERSION) .

docker-stg-build:
	docker build --build-arg VUE_APP_BASE_API=$(VUE_APP_BASE_API) -t leeif/pluto-admin:staging .

docker-push:
	docker push leeif/pluto-admin:$(VERSION)

docker-stg-push:
	docker push leeif/pluto-admin:staging

docker-clean:
	docker rmi leeif/pluto-admin:$(VERSION) || true
	docker rm -v $(shell docker ps --filter status=exited -q 2>/dev/null) 2>/dev/null || true
	docker rmi $(shell docker images --filter dangling=true -q 2>/dev/null) 2>/dev/null || true

docker-stg-clean:
	docker rmi leeif/pluto-admin:staging || true
	docker rm -v $(shell docker ps --filter status=exited -q 2>/dev/null) 2>/dev/null || true
	docker rmi $(shell docker images --filter dangling=true -q 2>/dev/null) 2>/dev/null || true

check-version-tag:
	git pull --tags || true
	if git --no-pager tag --list | grep $(VERSION) -q ; then echo "$(VERSION) already exsits"; exit 1; fi

update-tag:
	git pull --tags || true
	if git --no-pager tag --list | grep $(VERSION) -q ; then echo "$(VERSION) already exsits"; exit 1; fi
	git tag $(VERSION)
	git push origin $(VERSION)

jenkins-ci: check-version-tag update-tag

ci-build-production: check-version-tag docker-build docker-push docker-clean update-tag

ci-build-staging: docker-stg-build docker-stg-push docker-stg-clean
