import { Box, Card, Grid} from "@mui/material";

export const CardRequest = ()=>{

    return(
        <Box>
            <Grid sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '50%', md: '32%' } }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                </Card>
              </Grid>
        </Box>
    )
}