# Verification discovery

Read the project scripts, test configuration, and applicable CI jobs.
If a wrapper starts the runner, examine its filters and options.
Before an integration test, make sure that the necessary test services and fixtures are available.
Use disposable services or isolated test namespaces.
Before you do a test with external effects, make sure that you have authorization for those effects.
If credentials or external services are missing, do the checks that use the available resources.
If the test summary gives only totals, use a runner option that shows test names.
For a conditional skip, find the condition in the test configuration or code.
