import socket
from contextlib import closing
import subprocess

AVAILABLE_PORTS = [5006, 5007, 5008, 5009, 5010]

def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('0.0.0.0', port)) == 0


def start_bokeh_server():
    for p in AVAILABLE_PORTS:
        import subprocess
        process = subprocess.Popen(
            ['/bin/bash', './run_sanbox.sh', str(p)], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )

        stdout, _ = process.communicate()
        container_id = stdout.decode("utf-8")

        if not process.returncode:
            print(f"Started bokeh server on port {p}")
            return p

