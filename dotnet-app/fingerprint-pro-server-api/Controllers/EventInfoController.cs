using FingerprintPro.ServerSdk.Api;
using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;


namespace fingerprint_pro_server_api.Controllers
{
    [ApiController]
    [Route("api/event-info")]
    public class EventInfoController : ControllerBase
    {
        [HttpGet]
        public NotFound<string> Get()
        {
            return TypedResults.NotFound("eventId must be provided in the following format: api/event-info/{eventId}");
        }

        [HttpGet("{eventId}")]
        public Results<Ok<EventResponse>, NotFound> Get(string eventId)
        {
            if (String.IsNullOrEmpty(eventId)) {
                throw new ArgumentNullException("Missing eventId");
            }

            var fpSecretApiKey = Environment.GetEnvironmentVariable("FP_SECRET_API_KEY");

            if (String.IsNullOrEmpty(fpSecretApiKey)) {
                throw new ArgumentNullException("Missing Fingerprint Server API Key");
            }

            var configuration = new Configuration(fpSecretApiKey);
            configuration.Region = Region.Eu;

            var api = new FingerprintApi(
                configuration
            );

            try
            {
                var fpEvent = api.GetEvent(eventId);
                return TypedResults.Ok(fpEvent);
            }
            catch (Exception e) {
                return TypedResults.NotFound();
            }


        }
    }
}

