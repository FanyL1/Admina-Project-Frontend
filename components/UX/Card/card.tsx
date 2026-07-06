import { Box, Card, Grid} from "@mui/material";
import { Children } from "react";



export const Cards = ({ children, sx }: { children?: React.ReactNode; sx?: any })=>{

    return(
        <Box>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                      borderColor: 'linear-gradient(90deg, #32539A, #B2C2E6, #B2C2E6)'
                    }
                  }}
                >
                    {children}
                </Card>
        </Box>
    )
}