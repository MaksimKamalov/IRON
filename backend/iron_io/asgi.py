"""
ASGI config for iron_io project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

# import os

# import  django
# from channels.http import AsgiHandler 
# from channels.routing import ProtocolTypeRouter

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iron_io.settings')
# django.setup() 

# application = ProtocolTypeRouter({ 
#   "http": AsgiHandler(), 
# })

import os
from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns
from channels.routing import URLRouter


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DjangoWebSocketChat.settings')


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})
