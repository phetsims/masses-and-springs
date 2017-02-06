// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var TITLE_FONT = new PhetFont( { size: 12, weight: 'bold' } );

  /**
   *
   * @param {Object} options
   * @constructor
   */
  function ToolBoxNode( options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5
    }, options );


    Panel.call( this, new HBox( {
      align: 'center',
      children: [
        new HStrut( 20 ),
        new Text( 'Ruler', { font: TITLE_FONT } ),
        new HStrut( 20 ),
        new Text( 'Stopwatch ', { font: TITLE_FONT } ),
        new HStrut( 20 )
      ]
    } ), options );
  }

  massesAndSprings.register( 'ToolBoxNode', ToolBoxNode );

  return inherit( Panel, ToolBoxNode );

} );
