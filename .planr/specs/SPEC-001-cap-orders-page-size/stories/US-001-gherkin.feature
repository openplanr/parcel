Feature: Bound GET /orders pageSize to 1–100

  Background:
    Given the order store holds 3 orders
    And the configured defaultPageSize is 2

  # AC-001
  Scenario: pageSize above the maximum is clamped
    When I request GET /orders?pageSize=101
    Then the response status is 200
    And the body reports pageSize 100

  # AC-002
  Scenario: pageSize at the maximum is accepted
    When I request GET /orders?pageSize=100
    Then the response status is 200
    And the body reports pageSize 100

  # AC-003
  Scenario: pageSize at the minimum is accepted
    When I request GET /orders?pageSize=1
    Then the response status is 200
    And the body reports pageSize 1
    And the body contains 1 item

  # AC-004
  Scenario: pageSize of zero is rejected
    When I request GET /orders?pageSize=0
    Then the response status is 400
    And the body is {"error": "pageSize must be a positive integer, got 0"}

  # AC-005
  Scenario: negative pageSize is rejected
    When I request GET /orders?pageSize=-5
    Then the response status is 400

  # AC-006
  Scenario Outline: non-integer pageSize is rejected
    When I request GET /orders?pageSize=<value>
    Then the response status is 400

    Examples:
      | value |
      | abc   |
      | 2.5   |

  # AC-007
  Scenario: omitted pageSize uses the configured default
    When I request GET /orders
    Then the response status is 200
    And the body contains 2 items
