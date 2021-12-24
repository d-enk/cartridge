local cartridge_opts = {
    'advertise_uri',
    'alias',
    'auth_backend_name',
    'auth_enabled',
    'bucket_count',
    'console_sock',
    'http_enabled',
    'http_host',
    'http_port',
    'roles',
    'roles_reload_allowed',
    'swim_broadcast',
    'upgrade_schema',
    'upload_prefix',
    'vshard_groups',
    'webui_blacklist',
    'webui_enabled',
    'webui_enforce_root_redirect',
    'webui_prefix',
    'workdir',
}

local box_opts = {
    'background',
    'checkpoint_count',
    'checkpoint_interval',
    'checkpoint_wal_threshold',
    'custom_proc_title',
    'election_mode',
    'election_timeout',
    'feedback_enabled',
    'feedback_host',
    'feedback_interval',
    'force_recovery',
    'hot_standby',
    'instance_uuid',
    'io_collect_interval',
    'iproto_threads',
    'listen',
    'log',
    'log_format',
    'log_level',
    'log_nonblock',
    'memtx_dir',
    'memtx_max_tuple_size',
    'memtx_memory',
    'memtx_min_tuple_size',
    'memtx_use_mvcc_engine',
    'net_msg_max',
    'pid_file',
    'read_only',
    'readahead',
    'replicaset_uuid',
    'replication',
    'replication_anon',
    'replication_connect_quorum',
    'replication_connect_timeout',
    'replication_skip_conflict',
    'replication_sync_lag',
    'replication_sync_timeout',
    'replication_synchro_quorum',
    'replication_synchro_timeout',
    'replication_timeout',
    'slab_alloc_factor',
    'snap_io_rate_limit',
    'sql_cache_size',
    'strip_core',
    'too_long_threshold',
    'username',
    'vinyl_bloom_fpr',
    'vinyl_cache',
    'vinyl_dir',
    'vinyl_max_tuple_size',
    'vinyl_memory',
    'vinyl_page_size',
    'vinyl_range_size',
    'vinyl_read_threads',
    'vinyl_run_count_per_level',
    'vinyl_run_size_ratio',
    'vinyl_timeout',
    'vinyl_write_threads',
    'wal_dir',
    'wal_dir_rescan_delay',
    'wal_max_size',
    'wal_mode',
    'work_dir',
    'worker_pool_threads',
}

return {
    box_opts = box_opts,
    cartridge_opts = cartridge_opts,
}