Feature: Historical Risk Forecasting
  As a project manager
  I want to receive risk forecasts based on weather and my site's history
  So that I can prioritize maintenance specifically for high-risk storm events

  Scenario: High risk due to severe weather and poor history
    Given a site "Site-X" has a historical compliance rate of 60%
    And the upcoming weather forecast predicts 2.5 inches of rain
    When I request a risk forecast for "Site-X"
    Then the risk level should be "Critical"
    And the confidence score should be high

  Scenario: Low risk due to mild weather and perfect history
    Given a site "Site-Y" has a historical compliance rate of 100%
    And the upcoming weather forecast predicts 0.1 inches of rain
    When I request a risk forecast for "Site-Y"
    Then the risk level should be "Low"
    And the risk score should be less than 20
