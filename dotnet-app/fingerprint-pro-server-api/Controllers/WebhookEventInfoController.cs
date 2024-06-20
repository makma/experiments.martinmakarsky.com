using System.Text;
using FingerprintPro.ServerSdk;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace fingerprint_pro_server_api.Controllers
{
    [ApiController]
    [Route("api/webhook-event-info")]
    public class WebhookEventInfoController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public WebhookEventInfoController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public NotFound<string> Get()
        {
            return TypedResults.NotFound("requestId must be provided in the following format: api/webhook-event-info/{requestId}");
        }

        [HttpGet("{requestId}")]
        public async Task<IActionResult> Get(string requestId)
        {
            if (string.IsNullOrEmpty(requestId))
            {
                return NotFound();
            }
            var webhookSecret = Environment.GetEnvironmentVariable("WEBHOOK_SECRET");
            if (string.IsNullOrEmpty(webhookSecret))
            {
                throw new ArgumentNullException("Missing Fingerprint Webhook Secret");
            }
            var client = _httpClientFactory.CreateClient();
            var url = $"https://experiments.martinmakarsky.com/api/get-raw-webhook-event?requestId={requestId}";
            var response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                dynamic jsonObj = JsonConvert.DeserializeObject<dynamic>(content);
                string bodyString = JsonConvert.SerializeObject(jsonObj.webhookEvent.body);
                byte[] byteArray = Encoding.UTF8.GetBytes(bodyString);
                string signature = jsonObj.webhookEvent.headers["fpjs-event-signature"];
                var isValid = Webhook.IsValidWebhookSignature(signature, byteArray, webhookSecret);
                if (isValid)
                {
                    return Ok("Webhook signature is valid.");
                }
                else
                {
                    return NotFound("Invalid webhook signature.");
                }
            }
            else
            {
                return NotFound();
            }
        }
    }
}

