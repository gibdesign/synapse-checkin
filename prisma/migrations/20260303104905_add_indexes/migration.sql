-- CreateIndex
CREATE INDEX "CheckinRequest_userId_idx" ON "CheckinRequest"("userId");

-- CreateIndex
CREATE INDEX "CheckinRequest_status_idx" ON "CheckinRequest"("status");

-- CreateIndex
CREATE INDEX "User_leaderboardVisible_accountStatus_idx" ON "User"("leaderboardVisible", "accountStatus");
