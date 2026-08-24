from google.cloud import bigquery
from google.oauth2 import service_account


SERVICE_ACCOUNT_FILE = "/etc/secrets/serviceAccountKey.json"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE
)

client = bigquery.Client(
    credentials=credentials,
    project="civic-506318"
)

TABLE_ID = "civic-506318.governance_data.citizen_requests"


def save_to_bigquery(data):

    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND
    )

    job = client.load_table_from_json(
        [data],
        TABLE_ID,
        job_config=job_config
    )

    job.result()

    return True