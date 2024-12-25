const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const app = express();
app.use(express.json());

const bedrockClient = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AWS_ACCESS_KEY_ID',
        secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    },
});

app.post('/validate-question', async (req, res) => {
    const { question } = req.body;

    try {
        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: `Verify if this math question is appropriate for mental math practice: ${question}. Respond with 'yes' or 'no'.`
            }]
        };

        const command = new InvokeModelCommand({
            ModelId: 'anthropic.claude-v2',
            ContentType: 'application/json',
            Accept: 'application/json',
            Body: JSON.stringify(payload),
        });

        const response = await bedrockClient.send(command);
        const responseData = JSON.parse(new TextDecoder().decode(response.Body));
        const isAppropriate = responseData.completion.toLowerCase().includes('yes');

        res.json({ isAppropriate });
    } catch (error) {
        console.error('Error validating question:', error);
        res.status(500).json({ isAppropriate: false });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
no