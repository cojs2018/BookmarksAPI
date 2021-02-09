echo "Conducting unit test"
jest --coverage

echo "Conducting end to end test"
cd tests/end2end
newman run bookmarks-collection.postman_collection.json
cd ../../