package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v5/sdk"
	"github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    router.GET("/", getIndex)

    router.GET("/event-info/:requestId", getEventByRequestId)

    // Needed for the Digital Ocean Deployment
    router.Run("0.0.0.0:8081")
}

func getIndex(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, "Nothing to see here...")
}

func getEventByRequestId(c *gin.Context) {
    requestId := c.Param("requestId")

    cfg := sdk.NewConfiguration()
    cfg.ChangeRegion(sdk.RegionEU)

    client := sdk.NewAPIClient(cfg)

    auth := context.WithValue(context.Background(), sdk.ContextAPIKey, sdk.APIKey{
		Key: os.Getenv("FINGERPRINT_SECRET_API_KEY"),
	})

    response, httpRes, err := client.FingerprintApi.GetEvent(auth, requestId)
	fmt.Printf("%+v\n", httpRes)
	if err != nil {
		switch err.(type) {
		case *sdk.GenericSwaggerError:
			switch model := err.(sdk.GenericSwaggerError).Model().(type) {
			case sdk.ManyRequestsResponse:
				log.Printf("Too many requests, retry after %d seconds", model.RetryAfter)
			}

		default:
			log.Fatal(err)
		}

	}
    c.IndentedJSON(http.StatusOK, response)
}