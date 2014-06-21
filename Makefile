test:
	@node node_modules/lab/bin/lab
test-cov:
	@node node_modules/lab/bin/lab -t 100 -v
test-cov-json:
	@node node_modules/lab/bin/lab -r json -o coverage.json

.PHONY: test test-cov test-cov-json
