// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
  var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergyGraphNode( model, tandem ) {
    var content = new Text( 'PhET Energy Graph \n Coming Soon' );
    var barNodes = [
      new VerticalBarNode( model.masses.adjustableMass.massProperty ),
      new VerticalBarNode( model.springs[ 0 ].springConstantProperty ),
      new VerticalBarNode( model.frictionProperty ),
      new VerticalBarNode( model.gravityProperty )
    ];
    
    AccordionBox.call( this, new VBox( {
      children: [
        content,
        new VerticalBarChart( barNodes
          , { width: 100, height: 300 }
        )
      ]
    } ), {
      titleNode: new Text( 'Energy Graph' )
    } );
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
