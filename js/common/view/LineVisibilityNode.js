// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  // constants
  var LINE_LENGTH = 25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function LineVisibilityNode( model, tandem, options ) {
    options = _.extend( {
      massEquilibrium: false,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'LineVisibilityNode' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
    }, options );

    Node.call( this, options );

    /**
     * Creates line for visual representation within the panel.
     * @param {string} color
     * @param {Tandem} tandem
     * @returns {Line} line object with passed in color.
     */
    var createLine = function( color, tandem ) {
      return new Line( 0, 0, LINE_LENGTH, 0, {
        //REVIEW: It's only a slight shortcut, but you can omit all 4 parameters at the start, and just specify x2: LINE_LENGTH in the options
        stroke: color,
        lineDash: [ 6, 2.5 ],
        lineWidth: 2.0,
        cursor: 'pointer',
        tandem: tandem
      } );
    };

    // Lines added for reference in panel
    var greenLine = createLine( 'rgb(0, 180, 0)', tandem.createTandem( 'greenLine' ) );
    var blueLine = createLine( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    var redLine = createLine( 'red', tandem.createTandem( 'redLine' ) );

    var equilibriumText = new Text( equilibriumPositionString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      tandem: tandem.createTandem( 'equilibriumPositionString' )
    } );

    if ( options.massEquilibrium ) {
      equilibriumText = new Text( massEquilibriumString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        tandem: tandem.createTandem( 'equilibriumPositionString' )
      } );
    }

    //REVIEW: I'm curious why HBoxes are getting tandems here?

    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      content: new HBox( {
        children: [ new Text( naturalLengthString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'naturalLengthString' )
        } ) ],
        tandem: tandem.createTandem( 'naturalLengthHBox' )
      } ),
      property: model.naturalLengthVisibleProperty,
      label: naturalLengthString
    }, {
      content: new HBox( {
        children: [ equilibriumText ],
        tandem: tandem.createTandem( 'equilibriumPositionHBox' )
      } ),
      property: model.equilibriumPositionVisibleProperty,
      label: equilibriumPositionString
    }, {
      content: new HBox( {
        children: [ new Text( movableLineString, {
          font: MassesAndSpringsConstants.TITLE_FONT, tandem: tandem.createTandem( 'movableLineString' )
        } ) ],
        tandem: tandem.createTandem( 'movableLineHBox' )
      } ),
      property: model.movableLineVisibleProperty,
      label: movableLineString
    } ], {
      boxWidth: 15,
      spacing: 8,
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    var lineVBox = new VBox( {
      children: [
      //REVIEW: Use spacing here?
        blueLine,
        new VStrut( 24 ),
        greenLine,
        new VStrut( 24 ),
        redLine,
      ], yMargin: 0
    } );
    var controlBox = new HBox( {
      children: [
        //REVIEW: More struts, can we just use padding or other structuring instead of these?
        indicatorVisibilityControlsVBox,
        new HStrut( 10 ),
        lineVBox,
        new HStrut( 10 )
      ]
    } );
    this.addChild( controlBox );
  }

  massesAndSprings.register( 'LineVisibilityNode', LineVisibilityNode );

  return inherit( Node, LineVisibilityNode );
} );