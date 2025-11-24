import unittest
import io
from app import app

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_preview(self):
        data = {
            'file': (io.BytesIO(b"col1,col2\n1,2\n3,4"), 'test.csv')
        }
        response = self.app.post('/preview', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn('columns', json_data)
        self.assertIn('data', json_data)
        self.assertEqual(json_data['columns'], ['col1', 'col2'])

    def test_convert(self):
        data = {
            'file': (io.BytesIO(b"col1,col2\n1,2\n3,4"), 'test.csv')
        }
        response = self.app.post('/convert', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

if __name__ == '__main__':
    unittest.main()
