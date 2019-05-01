workflow "Master: test, build, deploy" {
  resolves = ["Notify Deploy End", "Notify Master Start"]
  on = "push"
}

workflow "Branch: test" {
  resolves = ["Notify Test End", "Notify Branch Start"]
  on = "push"
}

action "Filter master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Notify Master Start" {
  needs = ["Filter master"]
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`img-viewer master` push received :+1: $GITHUB_SHA'"]
  secrets = ["DC_ID", "DC_TOKEN"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "ci"
}

# action "Unit Tests" {
#   uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
#   needs = ["Install"]
#   args = "test"
# }

action "Deploy" {
  needs = ["Filter master", "Notify Master Start"]
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://mosey.systems/api/vanatu", "action=completed", "repository=img-viewer", "X-Hub-Signature:$HUB_SIGNATURE"]
  secrets = ["HUB_SIGNATURE"]

  # action "Unit Tests" {
  #   uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  #   needs = ["Install"]
  #   args = "test"
  # }

  # action "Unit Tests" {
  #   uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  #   needs = ["Install"]
  #   args = "test"
  # }
}

action "Notify Deploy End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Deploy"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`img-viewer` Deploy Complete :tada: $GITHUB_SHA'"]
}

action "Filter not master" {
  uses = "actions/bin/filter@master"
  args = "not branch master"
}

action "Notify Branch Start" {
  needs = ["Filter not master"]
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`img-viewer` branch push received :+1: $GITHUB_SHA'"]
  secrets = ["DC_ID", "DC_TOKEN"]
}

action "Notify Test End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Filter not master"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`img-viewer` Tests Complete :tada: $GITHUB_SHA'"]
}
