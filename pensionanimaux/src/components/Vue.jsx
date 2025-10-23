import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import Entree from "./Entree";
import Chien from "./Chien";
import Proprio from "./proprio";
import Comptabilite from "./Comptabilite";
import Sidebar from "./sidebar";

const Vue = () => {
    const chartRef = useRef(null);
    const paginationWrapperRef = useRef(null);
    const morphRef = useRef(null);
    const [activeComponent, setActiveComponent] = useState("Vue d'ensemble");
    const leaderboardData = [
      {
        rank: 1,
        name: "John Doe",
        points: 500,
        activity: "Running",
        lastActive: "2 hours ago",
        streak: 7,
        totalActivityTime: "2 hours 30 minutes",
        achievements: ["Completed Weekly Challenge", "Reached 10,000 Steps"]
      },
      {
        rank: 2,
        name: "Jane Smith",
        points: 450,
        activity: "Cycling",
        lastActive: "1 hour ago",
        streak: 5,
        totalActivityTime: "1 hour 45 minutes",
        achievements: ["Completed Daily Workout"]
      },
      {
        rank: 3,
        name: "David Lee",
        points: 400,
        activity: "Yoga",
        lastActive: "Yesterday",
        streak: 0,
        totalActivityTime: "30 minutes",
        achievements: []
      },
      {
        rank: 4,
        name: "Sarah Jones",
        points: 380,
        activity: "Swimming",
        lastActive: "2 days ago",
        streak: 3,
        totalActivityTime: "1 hour 15 minutes",
        achievements: ["Completed Weekly Challenge", "Reached 5000 Steps"]
      },
      {
        rank: 5,
        name: "Michael Brown",
        points: 350,
        activity: "Hiking",
        lastActive: "3 days ago",
        streak: 2,
        totalActivityTime: "2 hours 00 minutes",
        achievements: ["Completed Daily Workout"]
      },
      {
        rank: 6,
        name: "Emily Davis",
        points: 320,
        activity: "Walking",
        lastActive: "Today",
        streak: 1,
        totalActivityTime: "45 minutes",
        achievements: []
      },
      {
        rank: 7,
        name: "Daniel Garcia",
        points: 280,
        activity: "Weightlifting",
        lastActive: "4 days ago",
        streak: 0,
        totalActivityTime: "1 hour 30 minutes",
        achievements: ["Reached 10,000 Steps"]
      },
      {
        rank: 8,
        name: "Christopher Evans",
        points: 250,
        activity: "Running",
        lastActive: "5 days ago",
        streak: 1,
        totalActivityTime: "1 hour 00 minutes",
        achievements: ["Completed Daily Workout"]
      },
      {
        rank: 9,
        name: "Olivia Young",
        points: 220,
        activity: "Yoga",
        lastActive: "Today",
        streak: 1,
        totalActivityTime: "30 minutes",
        achievements: []
      },
      {
        rank: 10,
        name: "James Wilson",
        points: 200,
        activity: "Cycling",
        lastActive: "2 days ago",
        streak: 0,
        totalActivityTime: "45 minutes",
        achievements: ["Completed Weekly Challenge"]
      }
    ];
    
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(leaderboardData.length / 5); // Show 5 per page
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  
      // Ajout d'un délai pour s'assurer que les refs sont montées
      setTimeout(() => {
        if (!paginationWrapperRef.current || !morphRef.current) return;
    
        const activeButton = paginationWrapperRef.current.querySelector(`button[data-page="${pageNumber}"]`);
        if (!activeButton) return;

        const { left, top, width, height, borderRadius } = activeButton.getBoundingClientRect();
        const { left: paginationLeft, top: paginationTop } = paginationWrapperRef.current.getBoundingClientRect();
    
        morphRef.current.style.width = `${width}px`;
        morphRef.current.style.height = `${height}px`;
        morphRef.current.style.transform = `translate(${left - paginationLeft}px, ${top - paginationTop}px)`;
        morphRef.current.style.borderRadius = borderRadius;
        morphRef.current.classList.add('visible');
    
        setTimeout(() => {
          if (morphRef.current) {
            morphRef.current.classList.add('has-transition');
          }
        }, 10);
      }, 0);
    };
  
    const renderPagination = () => {
      const buttons = [];
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button
              className="page-link"
              data-page={i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          </li>
        );
      }
  
      return (
        <nav className="position-relative" aria-label="Page navigation" ref={paginationWrapperRef}>
          <ul className="pagination">{buttons}</ul>
          <div ref={morphRef} className="morph-bg"></div>
        </nav>
      );
    };
    
    useEffect(() => {
      if (paginationWrapperRef.current && morphRef.current) {
        handlePageChange(currentPage);
      }
    }, [currentPage]);
  
    useEffect(() => {
      if (!chartRef.current) return;

      const ctx = chartRef.current.getContext("2d");
  
      // Vérifiez si le contexte est valide avant de créer le graphique
      if (!ctx) {
        console.error("Le contexte du canvas est introuvable.");
        return;
      }

      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July"
          ],
          datasets: [
            {
              label: "This Year",
              data: [12200, 12000, 8000, 18970, 11000, 14500, 9300], 
              fill: true,
              backgroundColor: "#F2865E",
              borderColor: "#F2865E",
              borderWidth: 0.8,
              borderRadius: 20,
              barThickness: 8
            },
            {
              label: "Last Year",
              data: [9500, 11500, 7500, 16900, 4500, 11410, 8500], 
              fill: true,
              backgroundColor: "#F2C1AE",
              borderColor: "#F2C1AE",
              borderWidth: 0.8,
              borderRadius: 20,
              barThickness: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
  
      return () => {
        myChart.destroy();
      };
    }, []);
  
    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };
  
    return (
      <>
        <Sidebar onComponentChange={handleComponentChange} activeComponent={activeComponent} />
        {activeComponent === "Vue d'ensemble" && (
          <>
            <h1 className="h3 ms-6 mt-4 mt-md-0 ms-md-0 mb-3">Dashboard</h1>
            <div className="row g-3">
              <div className="col-lg-6">
                <div className="card card-stat h-100">
                  <div className="card-body">
                    <h5 className="card-title">Today's Summary</h5>
                    <p className="text-muted">
                      You've walked 850 steps more than yesterday. You're doing great,
                      keep it up! You have about 2 hours left until sunset.
                    </p>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 g-3">
                      <div className="col">
                        <div className="card card-stat h-100">
                          <div className="card-body">
                            <h5 className="card-title">Box disponibles</h5>
                            <p className="card-text display-6 m-0">7,217</p>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card card-stat h-100">
                          <div className="card-body">
                            <h5 className="card-title">Chiens en pensions</h5>
                            <p className="card-text display-6 m-0">
                              3.6<span className="fs-small">mi</span>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card card-stat h-100">
                          <div className="card-body">
                            <h5 className="card-title">Departs Aujourd'hui</h5>
                            <p className="card-text display-6 m-0">303</p>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card card-stat h-100">
                          <div className="card-body">
                            <h5 className="card-title">Entrée Aujourd'hui</h5>
                            <p className="card-text display-6 m-0">
                              6<span className="fs-small">hr</span> 2
                              <span className="fs-small">min</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Recoltés sur l'année</h5>
                    <div className="chart-wrap">
                      <canvas ref={chartRef} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Liste des départs et entrée de la journée</h5>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="form-group mb-3 field-with-icon search">
                          <input type="search" className="form-control" id="floatingInput" placeholder="Search by name or activity" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <table className="table">
                        <thead className="bg-light">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Heure</th>
                            <th scope="col">Pris en charge</th>
                            <th scope="col">Box occupés</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboardData.slice((currentPage - 1) * 5, currentPage * 5).map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{item.rank}</th>
                              <td>{item.name}</td>
                              <td>{item.points}</td>
                              <td>{item.activity}</td>
                              <td>{item.lastActive}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {renderPagination()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
         </>
    );
  };

  export default Vue;