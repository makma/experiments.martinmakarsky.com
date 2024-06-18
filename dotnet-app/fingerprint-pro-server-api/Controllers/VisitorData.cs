using FingerprintPro.ServerSdk.Api;
using FingerprintPro.ServerSdk.Client;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;


namespace fingerprint_pro_server_api.Controllers
{
    [ApiController]
    [Route("api/visitor-data")]
    public class VisitorDataController : ControllerBase
    {
        [HttpGet]
        public NotFound<string> Get()
        {
            return TypedResults.NotFound("visitorId and deleletionSecret must be provided in the following format: DELETE api/visitor-data?{visitorId}&{deletionSecret}");
        }

        // Only I and the CI tests can delete the data, very naive, do not copy this code, harmless on the testing sub, harmful on prod use
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync([FromQuery] string visitorId, [FromQuery] string deletionSecret)
        {
            if (string.IsNullOrEmpty(visitorId) || string.IsNullOrEmpty(deletionSecret))
            {
                return BadRequest("visitorId and deletionSecret are required.");
            }

            var fpSecretApiKey = Environment.GetEnvironmentVariable("FP_SECRET_API_KEY");

            if (String.IsNullOrEmpty(fpSecretApiKey))
            {
                throw new ArgumentNullException("Missing Fingerprint Server API Key");
            }

            if (deletionSecret != Environment.GetEnvironmentVariable("DELETION_SECRET")) {
                return Forbid("deletionSecret does not match");
            }

            bool isDeleted = await DeleteVisitorDataAsync(visitorId, fpSecretApiKey);

            if (isDeleted)
            {
                return Ok("Visitor data sheduled to be deleted");
            }
            else
            {
                return BadRequest("Fingerprint Server API didn't schedule visitor data to be deleted.");
            }
        }

        private async Task<bool> DeleteVisitorDataAsync(string visitorId, string secretApiKey)
        {
            var configuration = new Configuration(secretApiKey);
            configuration.Region = Region.Eu;

            var api = new FingerprintApi(
                configuration
            );

            try
            {
                await api.DeleteVisitorDataAsync(visitorId);
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}

