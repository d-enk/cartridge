#!/usr/bin/env python3

import pytest
import logging
from conftest import Server

cluster = [
    Server(
        alias = 'router',
        instance_uuid = 'aaaaaaaa-aaaa-4000-b000-000000000001',
        replicaset_uuid = 'aaaaaaaa-0000-4000-b000-000000000000',
        roles = ['vshard-router', 'vshard-storage'],
        binary_port = 33001,
        http_port = 8081
    )
]

def test_api(cluster):
    obj = cluster['router'].graphql("""
        {
            cluster {
                can_bootstrap_vshard
                vshard_bucket_count
                vshard_known_groups
            }
        }
    """)
    assert 'errors' not in obj, obj['errors'][0]['message']
    assert obj['data']['cluster']['can_bootstrap_vshard'] == False
    assert obj['data']['cluster']['vshard_bucket_count'] == 3000
    assert obj['data']['cluster']['vshard_known_groups'] == ['default']

def test_router_role(cluster):

    resp = cluster['router'].conn.eval("""
        local vshard = require('vshard')
        local cluster = require('cluster')
        local router_role = assert(cluster.service_get('vshard-router'))

        assert(router_role.get() == vshard.router.static, "Default router is initialized")
        return {
            null = router_role.get():call(1, 'read', 'get_uuid'),
            default = router_role.get('default'):call(1, 'read', 'get_uuid'),
            static = vshard.router.call(1, 'read', 'get_uuid'),
        }
    """)

    assert resp[0] == {
        'null': 'aaaaaaaa-aaaa-4000-b000-000000000001',
        'static': 'aaaaaaaa-aaaa-4000-b000-000000000001',
        'default': 'aaaaaaaa-aaaa-4000-b000-000000000001'
    }