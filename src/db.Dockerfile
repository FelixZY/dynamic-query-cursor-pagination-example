FROM supabase/postgres:orioledb-15.1.1.5_amd64
ENV POSTGRES_PASSWORD=postgres
# Supabase's migrations are placed in migrations/
ADD init /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD [ "postgres", "-c", "config_file=/etc/postgresql/postgresql.conf" ]
