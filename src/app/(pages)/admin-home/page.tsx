"use client";

import type React from "react";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  type SelectChangeEvent,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SortIcon from "@mui/icons-material/Sort";

// Sample data for contractors
const contractors = [
  {
    id: 1,
    name: "ABC Construction Ltd",
    avatar: "A",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 2,
    name: "Smith & Sons Builders",
    avatar: "S",
    complianceCertificate: true,
    verificationCertificate: false,
    status: "pending",
  },
  {
    id: 3,
    name: "City Electrical Services",
    avatar: "C",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 4,
    name: "Metro Plumbing Co.",
    avatar: "M",
    complianceCertificate: false,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 5,
    name: "Horizon Roofing",
    avatar: "H",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 6,
    name: "Premier Painting",
    avatar: "P",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 7,
    name: "Quality Carpentry Inc",
    avatar: "Q",
    complianceCertificate: false,
    verificationCertificate: false,
    status: "pending",
  },
  {
    id: 8,
    name: "Reliable HVAC Systems",
    avatar: "R",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
  {
    id: 9,
    name: "Evergreen Landscaping",
    avatar: "E",
    complianceCertificate: true,
    verificationCertificate: false,
    status: "pending",
  },
  {
    id: 10,
    name: "Secure Fencing Ltd",
    avatar: "S",
    complianceCertificate: true,
    verificationCertificate: true,
    status: "pending",
  },
];

// Create a theme with gold primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#D49F2E",
    },
    secondary: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#666",
        },
      },
    },
  },
});

export default function ContractorVerification() {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All Contractors");
  const [searchQuery, setSearchQuery] = useState("");
  const [contractorData, setContractorData] = useState(contractors);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const handleAccept = (id: number) => {
    setContractorData(contractorData.map((contractor) => (contractor.id === id ? { ...contractor, status: "accepted" } : contractor)));
  };

  const handleDecline = (id: number) => {
    setContractorData(contractorData.map((contractor) => (contractor.id === id ? { ...contractor, status: "declined" } : contractor)));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredContractors = contractorData.filter((contractor) => contractor.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography className="text-black " variant="h4" component="h1" fontWeight="bold">
              Hi Admin!
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f0f0f0",
                  borderRadius: 30,
                  p: 0.5,
                }}
              >
                <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} sx={{ mr: 0.5 }} size="small" />
              </Box> */}
              <IconButton>
                <NotificationsNoneIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: "#D49F2E" }}>R</Avatar>
            </Box>
          </Box>

          {/* Filters and Search */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={filter}
                onChange={handleFilterChange}
                displayEmpty
                size="small"
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                }}
                IconComponent={KeyboardArrowDownIcon}
              >
                <MenuItem value="All Contractors">All Contractors</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                placeholder="Search here..."
                size="small"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Contractors Table */}
          <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Company Name <SortIcon sx={{ ml: 0.5, fontSize: 18, color: "#999" }} />
                    </Box>
                  </TableCell>
                  <TableCell align="center">Compliance Certificate</TableCell>
                  <TableCell align="center">Verification Certificate</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContractors.map((contractor) => (
                  <TableRow
                    key={contractor.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      bgcolor:
                        contractor.status === "accepted"
                          ? "rgba(76, 175, 80, 0.1)"
                          : contractor.status === "declined"
                          ? "rgba(244, 67, 54, 0.1)"
                          : "inherit",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              contractor.status === "accepted" ? "#4CAF50" : contractor.status === "declined" ? "#f44336" : "#D49F2E",
                            width: 36,
                            height: 36,
                            mr: 2,
                          }}
                        >
                          {contractor.avatar}
                        </Avatar>
                        <Typography variant="body1" fontWeight={500}>
                          {contractor.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {contractor.complianceCertificate ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                          <Button size="small" startIcon={<VisibilityIcon />}>
                            View
                          </Button>
                        </Box>
                      ) : (
                        <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {contractor.verificationCertificate ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                          <Button size="small" startIcon={<VisibilityIcon />}>
                            View
                          </Button>
                        </Box>
                      ) : (
                        <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {contractor.status === "pending" ? (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => handleDecline(contractor.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleAccept(contractor.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Accept
                          </Button>
                        </Box>
                      ) : contractor.status === "accepted" ? (
                        <Chip label="Accepted" size="small" sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }} />
                      ) : (
                        <Chip label="Declined" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
