from channels.testing import WebsocketCommunicator
from django.test import TestCase
from .consumer import ChatConsumer

class ConsumerConnectionTest(TestCase):
    async def test_websocket_connection(self):
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/test_room/")
        communicator.scope["url_route"] = {"kwargs": {"room_name": "test_room"}}
        
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        await communicator.disconnect()
